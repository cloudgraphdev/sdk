import jsonpath, { PathComponent } from 'jsonpath'
import isEmpty from 'lodash/isEmpty'

import JsonEvaluator from './evaluators/json-evaluator'
import ManualEvaluator from './evaluators/manual-evaluator'
import JsEvaluator from './evaluators/js-evaluator'
import { RuleEvaluator } from './evaluators/rule-evaluator'
import { Engine, ResourceData, Rule, RuleFinding } from './types'
import { Entity } from '../types'

export default class RulesProvider implements Engine {
  evaluators: RuleEvaluator<any>[] = []

  private readonly typenameToFieldMap: { [typeName: string]: string }

  private readonly extraFields: string[]

  private readonly providerName

  private readonly entityName

  constructor({
    providerName,
    entityName,
    typenameToFieldMap,
    extraFields,
  }: {
    providerName: string
    entityName: string
    typenameToFieldMap?: { [tn: string]: string }
    extraFields?: string[]
  }) {
    this.extraFields = extraFields ?? []
    this.typenameToFieldMap = typenameToFieldMap ?? {}
    this.entityName = entityName
    this.providerName = providerName
    this.evaluators = [
      new JsonEvaluator(providerName, entityName),
      new JsEvaluator(providerName, entityName),
      new ManualEvaluator(providerName, entityName),
    ]
  }

  /**
   * Evaluates which Evaluator can be used for each rule
   * @param rule rule to evaluate
   * @returns A RuleEvaluator
   */
  private getRuleEvaluator = (rule: Rule): RuleEvaluator<any> => {
    for (const evaluator of this.evaluators) {
      if (evaluator.canEvaluate(rule)) {
        return evaluator
      }
    }
    return undefined
  }

  /**
   * Process a Rule with an RuleEvaluator
   * @param rule Rule to Process
   * @param evaluator RuleEvaluator
   * @param data Rule Data
   * @returns RuleFinding result
   */
  private processSingleResourceRule = async (
    rule: Rule,
    evaluator: RuleEvaluator<any>,
    data: ResourceData
  ): Promise<RuleFinding> => {
    const finding = await evaluator.evaluateSingleResource(rule, data)

    // Inject extra fields
    for (const field of this.extraFields) {
      finding[field] = data.resource[field]
    }

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
  private highlightPath(data: any, path: PathComponent[]): any {
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

  /**
   * Prepare the mutations for overall provider findings
   * @param findings RuleFinding array
   * @returns A formatted Entity array
   */
  private prepareProviderMutations = (
    findings: RuleFinding[] = []
  ): Entity[] => {
    // Prepare provider schema connections
    return [
      {
        name: `${this.providerName}Findings`,
        mutation: `
        mutation($input: [Add${this.providerName}FindingsInput!]!) {
          add${this.providerName}Findings(input: $input, upsert: true) {
            numUids
          }
        }
        `,
        data: {
          id: `${this.providerName}-provider`,
        },
      },
      {
        name: `${this.providerName}Findings`,
        mutation: `mutation update${this.providerName}Findings($input: Update${this.providerName}FindingsInput!) {
            update${this.providerName}Findings(input: $input) {
              numUids
            }
          }
          `,
        data: {
          filter: {
            id: { eq: `${this.providerName}-provider` },
          },
          set: {
            [`${this.entityName}Findings`]: findings.map(
              ({ typename, ...rest }) => ({ ...rest })
            ),
          },
        },
      },
    ]
  }

  getSchema = (): string[] => {
    const mainType = `
    enum FindingsResult {
      PASS
      FAIL
      MISSING
      SKIPPED
    }

    type ${this.providerName}Findings @key(fields: "id") {
      id: String! @id
      ${this.entityName}Findings: [${this.providerName}${
      this.entityName
    }Findings]
    }

    type ruleMetadata @key(fields: "id") {
      id: String! @id @search(by: [hash, regexp])
      severity: String! @search(by: [hash, regexp])
      description: String! @search(by: [hash, regexp])
      title: String @search(by: [hash, regexp])
      audit: String @search(by: [hash, regexp])
      rationale: String @search(by: [hash, regexp])
      remediation: String @search(by: [hash, regexp])
      references: [String] @search(by: [hash, regexp])
      findings: [baseFinding] @hasInverse(field: rule)
    }

    interface baseFinding {
      id: String! @id
      resourceId: String @search(by: [hash, regexp])
      rule: [ruleMetadata] @hasInverse(field: findings)
      result: FindingsResult @search
    }

    type ${this.providerName}${
      this.entityName
    }Findings implements baseFinding @key(fields: "id") {
      findings: ${this.providerName}Findings  @hasInverse(field: ${
      this.entityName
    }Findings)
      # extra fields
      ${this.extraFields.map(
        field => `${field}: String @search(by: [hash, regexp])`
      )}
      # connections
       ${Object.keys(this.typenameToFieldMap)
         .map(
           (tn: string) =>
             `${tn}: [${this.typenameToFieldMap[tn]}] @hasInverse(field: ${this.entityName}Findings)`
         )
         .join(' ')}
    }
      `
    const extensions = Object.keys(this.typenameToFieldMap)
      .map(
        (tn: string) =>
          `extend type ${this.typenameToFieldMap[tn]} {
   ${this.entityName}Findings: [${this.providerName}${this.entityName}Findings] @hasInverse(field: ${tn})
}`
      )
      .join('\n')

    return [mainType, extensions]
  }

  prepareMutations = (findings: RuleFinding[] = []): Entity[] => {
    // Prepare entities mutations
    const entitiesData = []
    for (const evaluator of this.evaluators) {
      entitiesData.push(...evaluator.prepareMutations())
    }

    // Prepare provider mutations
    const providerData = this.prepareProviderMutations(findings)

    return [...entitiesData, ...providerData]
  }

  processRule = async (rule: Rule, data: unknown): Promise<RuleFinding[]> => {
    const res: any[] = []
    const dedupeIds = {}
    const resourcePaths = data ? jsonpath.nodes(data, rule.resource) : []
    const evaluator = this.getRuleEvaluator(rule)

    if (isEmpty(data) && evaluator instanceof ManualEvaluator) {
      // Returned Manual Rule Response
      res.push(await evaluator.evaluateSingleResource(rule))
      return res
    }

    if (!evaluator) {
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
}
