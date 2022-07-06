import { JsonRule, Result, Rule, RuleFinding } from '../types'
import { RuleEvaluator } from './rule-evaluator'

export default class ManualEvaluator implements RuleEvaluator<JsonRule> {
  canEvaluate(rule: Rule): boolean {
    return !('gql' in rule) && !('conditions' in rule) && !('resource' in rule)
  }

  async evaluateSingleResource({ id, severity }: Rule): Promise<RuleFinding> {
    return {
      id: `${id}/manual`,
      result: Result.SKIPPED,
      typename: 'manual',
      rule: {
        id,
        severity,
      },
    } as RuleFinding
  }
}
