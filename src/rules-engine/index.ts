import jsonpath, { PathComponent } from 'jsonpath'
import isEmpty from 'lodash/isEmpty'
import groupBy from 'lodash/groupBy'

import JsonEvaluator from './evaluators/json-evaluator'
import JsEvaluator from './evaluators/js-evaluator'
import { RuleEvaluator } from './evaluators/rule-evaluator'
import DefaultEvaluator from './evaluators/default-evaluator'
import { Engine, ResourceData, Rule, RuleFinding, RuleResult } from './types'
import { ProviderData } from '../types'

export default class RulesProvider implements Engine {
  evaluators: RuleEvaluator<any>[] = [new JsonEvaluator(), new JsEvaluator()]

  defaultEvaluator = new DefaultEvaluator()

  private readonly typenameToFieldMap: { [typeName: string]: string }

  private readonly schemaTypeName

  constructor(
    typenameToFieldMap?: { [tn: string]: string },
    schemaTypeName?: string
  ) {
    this.typenameToFieldMap = typenameToFieldMap || {}
    this.schemaTypeName = schemaTypeName || ''
  }

  getSchema = (): string[] => {
    const mainType = `
    enum ${this.schemaTypeName}Result {
      PASS
      FAIL
      MISSING
    }
    type ${this.schemaTypeName} @key(fields: "id") {
      id: String! @id
      ruleId: String! @search(by: [hash, regexp])
      resourceId: String! @search(by: [hash, regexp])
      severity: String! @search(by: [hash, regexp])
      result: ${this.schemaTypeName}Result @search
      # connections
       ${Object.keys(this.typenameToFieldMap)
         .map(
           (tn: string) =>
             `${tn}: [${this.typenameToFieldMap[tn]}] @hasInverse(field: findings)`
         )
         .join(' ')}
    }
   `
    const extensions = Object.keys(this.typenameToFieldMap)
      .map(
        (tn: string) =>
          `extend type ${this.typenameToFieldMap[tn]} {
   findings: [${this.schemaTypeName}] @hasInverse(field: ${tn})
}`
      )
      .join('\n')

    return [mainType, extensions]
  }

  getRuleEvaluators(): RuleEvaluator<any>[] {
    // @TODO - we need to define how this is going to be decided at runtime (configuration)
    return this.evaluators
  }

  preprareMutations = (findings: RuleFinding[]): ProviderData => {
    const mutations = []
    // Group Findings by schema type
    const findingsByType = groupBy(findings, 'typename')

    for (const findingType in findingsByType) {
      if (findingType) {
        // Group Findings by resource
        const findingsByResource = groupBy(
          findingsByType[findingType],
          'resourceId'
        )

        for (const resource in findingsByResource) {
          if (resource) {
            const data = (
              (findingsByResource[resource] as RuleFinding[]) || []
            ).map(({ typename, ...properties }) => properties)

            // Create dynamically update mutations by resource
            const updateMutation = {
              name: this.schemaTypeName,
              count: data.length,
              mutation: `mutation update${findingType}($input: Update${findingType}Input!) {
                update${findingType}(input: $input) {
                  numUids
                }
              }
              `,
              data: {
                filter: {
                  id: { eq: resource },
                },
                set: {
                  findings: data,
                },
              },
            }

            mutations.push(updateMutation)
          }
        }
      }
    }

    return {
      connections: [] as any,
      entities: mutations,
    }
  }

  processRule = async (rule: Rule, data: unknown): Promise<RuleFinding[]> => {
    const res: any[] = []
    const dedupeIds = {}
    const resourcePaths = jsonpath.nodes(data, rule.resource)
    const evaluator = this.getRuleEvaluator(rule)

    if (!evaluator || isEmpty(data)) {
      return []
    }

    // @NOTE: here we can evaluate things such as Data being empty (may imply rule to pass)
    // or if we have no resources, or none pass, we can decide on that rule (+ some rule field)
    for (let i = 0; i < resourcePaths.length; i++) {
      const { path, value: resource } = resourcePaths[i]
      if (!resource.id) {
        // @NOTE: we'll support more complex rules in the future where you dont need a resource upfront
        continue // eslint-disable-line no-continue
      }
      if (dedupeIds[resource.id]) {
        // console.warn('Resource is duplicated, skipping', resource.id)
        continue // eslint-disable-line no-continue
      }
      dedupeIds[resource.id] = 1

      if (path[0] !== '$') {
        // console.log(
        //   'Is this case possible? how do we process it?',
        //   resourcePaths[i]
        // )
        continue // eslint-disable-line no-continue
      }
      const processedData = this.highlightPath(data, path)
      const ruleResult = await this.processSingleResourceRule(rule, evaluator, {
        data: processedData,
        resource,
        resourcePath: jsonpath.stringify(path),
      })
      if (ruleResult) {
        res.push({ ...ruleResult })
      }
    }
    return res
  }

  private getRuleEvaluator = (rule: Rule): RuleEvaluator<any> => {
    const evaluators = this.getRuleEvaluators()
    for (const evaluator of evaluators) {
      if (evaluator.canEvaluate(rule)) {
        return evaluator
      }
    }
    return this.defaultEvaluator
  }

  private processSingleResourceRule = async (
    rule: Rule,
    evaluator: RuleEvaluator<any>,
    data: ResourceData
  ): Promise<RuleFinding> => {
    const result = await evaluator.evaluateSingleResource(rule, data)

    const finding = {
      id: `${rule.id}/${data.resource.id}`,
      ruleId: rule.id,
      resourceId: data.resource.id,
      result: result !== RuleResult.MATCHES ? 'FAIL' : 'PASS',
      severity: rule.severity,
      typename: data.resource.__typename, // eslint-disable-line no-underscore-dangle
    } as RuleFinding

    const connField =
      data.resource.__typename && // eslint-disable-line no-underscore-dangle
      this.typenameToFieldMap[data.resource.__typename] // eslint-disable-line no-underscore-dangle

    if (connField) {
      finding[connField] = [{ id: data.resource.id }]
    }
    return finding
  }

  /**
   * traverse the path, and 'highlight' the path towards the resource
   * a[0].b.c[3].id === a['@'].b.c['@'].id // so rules can use this notation to know their parents
   */
  private highlightPath(data: any, path: PathComponent[]) {
    let curr = data // we can write the data, as next time we'll set the same fields
    for (let j = 1; j < path.length; j++) {
      const segment = path[j]
      if (Array.isArray(curr)) {
        // this is an array, we store in []._ the alias of this resource position in the array
        ;(curr as any)['@'] = curr[segment as number] // eslint-disable-line
      }
      curr = curr[segment]
    }
    return data
  }
}
