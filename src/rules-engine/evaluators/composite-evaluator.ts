import { JsonRule, Result, Rule, RuleFinding } from '../types'
import { RuleEvaluator } from './rule-evaluator'

export default class CompositeEvaluator implements RuleEvaluator<JsonRule> {
  canEvaluate(rule: Rule): boolean {
    return 'relatedRules' in rule
  }

  async evaluateSingleResource(rule: Rule): Promise<RuleFinding> {
    return {
      id: rule.id,
      result: Result.SKIPPED,
      typename: 'composite',
      rule,
    } as RuleFinding
  }
}
