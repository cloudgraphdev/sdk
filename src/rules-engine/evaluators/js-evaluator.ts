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
    { id, check, severity }: JsRule,
    data: ResourceData
  ): Promise<RuleFinding> {
    const result = check!(data) ? RuleResult.MATCHES : RuleResult.DOESNT_MATCH

    const finding = {
      id: `${id}/${data.resource?.id}`,
      resourceId: data.resource?.id,
      result: result !== RuleResult.MATCHES ? Result.FAIL : Result.PASS,
      typename: data.resource?.__typename, // eslint-disable-line no-underscore-dangle
      rule: {
        id,
        severity,
      },
    } as RuleFinding
    return finding
  }
}
