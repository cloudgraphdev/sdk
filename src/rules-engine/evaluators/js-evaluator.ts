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
    const result = rule.check!(data)
      ? RuleResult.MATCHES
      : RuleResult.DOESNT_MATCH

    const finding = {
      id: `${rule.id}/${data.resource?.id}`,
      ruleId: rule.id,
      resourceId: data.resource?.id,
      result: result !== RuleResult.MATCHES ? Result.FAIL : Result.PASS,
      severity: rule.severity,
      description: rule.description,
      rationale: rule.rationale,
      audit: rule.audit,
      remediation: rule.remediation,
      references: rule.references,
      typename: data.resource?.__typename, // eslint-disable-line no-underscore-dangle
    } as RuleFinding

    return finding
  }
}
