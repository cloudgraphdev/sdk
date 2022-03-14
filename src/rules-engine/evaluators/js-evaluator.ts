import {
  JsRule,
  ResourceData,
  Rule,
  RuleResult,
  RuleFinding,
  Result,
} from '../types'
import { RuleEvaluator } from './rule-evaluator'

export default class JsEvaluator implements RuleEvaluator<JsRule> {
  canEvaluate(rule: Rule | JsRule): boolean {
    return 'check' in rule
  }

  async evaluateSingleResource(
    rule: JsRule,
    data: ResourceData
  ): Promise<RuleFinding> {
    const { gql, check, resource, ...ruleMetadata } = rule
    const result = rule.check!(data)
      ? RuleResult.MATCHES
      : RuleResult.DOESNT_MATCH

    const finding = {
      id: `${rule.id}/${data.resource?.id}`,
      resourceId: data.resource?.id,
      result: result !== RuleResult.MATCHES ? Result.FAIL : Result.PASS,
      typename: data.resource?.__typename, // eslint-disable-line no-underscore-dangle
      rule: ruleMetadata,
    } as RuleFinding
    return finding
  }
}
