import jsonpath, { PathComponent } from 'jsonpath'
import isEmpty from 'lodash/isEmpty'

import JsonEvaluator from './evaluators/json-evaluator'
import ManualEvaluator from './evaluators/manual-evaluator'
import JsEvaluator from './evaluators/js-evaluator'
import { RuleEvaluator } from './evaluators/rule-evaluator'
import { Engine, ResourceData, Rule, RuleFinding } from './types'
import DataProcessor from './data-processors/data-processor'
import { Entity } from '../types'

export default class RulesProvider implements Engine {
  evaluators: RuleEvaluator<any>[] = []

  private readonly dataProcessor: DataProcessor

  constructor(dataProcessor: DataProcessor) {
    this.dataProcessor = dataProcessor
    this.evaluators = [
      new JsonEvaluator(),
      new JsEvaluator(),
      new ManualEvaluator(),
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
    for (const field of this.dataProcessor.extraFields) {
      finding[field] = data.resource[field]
    }

    const connField =
      data.resource.__typename && // eslint-disable-line no-underscore-dangle
      this.dataProcessor.typenameToFieldMap[data.resource.__typename] // eslint-disable-line no-underscore-dangle

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

  getSchema = (): string[] => this.dataProcessor.getSchema()

  processRule = async (rule: Rule, data: unknown): Promise<RuleFinding[]> => {
    const res: any[] = []
    const dedupeIds = {}
    const resourcePaths = data ? jsonpath.nodes(data, rule.resource) : []
    const evaluator = this.getRuleEvaluator(rule)

    if (!evaluator) {
      return []
    }

    if (isEmpty(data) && evaluator instanceof ManualEvaluator) {
      // Returned Manual Rule Response
      res.push(await evaluator.evaluateSingleResource(rule))
      return res
    }

    if (isEmpty(resourcePaths)) {
      // Returned Missing Resource Rule Response   
      res.push(await evaluator.evaluateMissingResource(rule))
      return res
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

  prepareMutations = (findings: RuleFinding[], rules: Rule[]): Entity[] => [
    ...this.dataProcessor.prepareRulesMetadataMutations(rules),
    ...this.dataProcessor.prepareFindingsMutations(findings),
  ]
}
