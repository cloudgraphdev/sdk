import { JsRule, ResourceData, Rule, RuleResult } from '../types'
import { RuleEvaluator } from './rule-evaluator'

export default class JsEvaluator implements RuleEvaluator<JsRule> {
  canEvaluate(rule: Rule | JsRule): boolean {
    return 'check' in rule
  }

  async evaluateSingleResource(
    rule: JsRule,
    data: ResourceData
  ): Promise<RuleResult> {
    return rule.check!(data) ? RuleResult.MATCHES : RuleResult.DOESNT_MATCH
  }
}
