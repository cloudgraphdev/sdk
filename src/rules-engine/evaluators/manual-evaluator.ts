import { JsonRule, Result, Rule, RuleFinding } from '../types'
import { RuleEvaluator } from './rule-evaluator'

export default class ManualEvaluator implements RuleEvaluator<JsonRule> {
  canEvaluate(rule: Rule): boolean {
    return !('gql' in rule) && !('conditions' in rule) && !('resource' in rule)
  }

  async evaluateSingleResource(rule: Rule): Promise<RuleFinding> {
    return {
      id: `${rule.id}/manual`,
      result: Result.SKIPPED,
      typename: 'manual',
      rule,
    } as RuleFinding
  }
}
