import { JsonRule, Result, Rule, RuleFinding } from '../types'
import { RuleEvaluator } from './rule-evaluator'

export default class ManualEvaluator implements RuleEvaluator<JsonRule> {
  canEvaluate(rule: Rule): boolean {
    return !('gql' in rule) && !('conditions' in rule) && !('resource' in rule)
  }

  async evaluateSingleResource(rule: Rule): Promise<RuleFinding> {
    return {
      id: `${rule.id}/manual`,
      ruleId: rule.id,
      result: Result.SKIPPED,
      severity: rule.severity,
      description: rule.description,
      rationale: rule.rationale,
      audit: rule.audit,
      remediation: rule.remediation,
      references: rule.references,
      typename: 'manual',
    } as RuleFinding
  }
}
