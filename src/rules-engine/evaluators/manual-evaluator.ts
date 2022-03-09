import { Entity } from '../../types'
import { JsonRule, Result, Rule, RuleFinding } from '../types'
import { RuleEvaluator } from './rule-evaluator'

export default class ManualEvaluator implements RuleEvaluator<JsonRule> {
  private readonly findings: RuleFinding[] = []

  private readonly providerName

  private readonly entityName

  constructor(providerName: string, entityName: string) {
    this.entityName = entityName
    this.providerName = providerName
  }

  canEvaluate(rule: Rule): boolean {
    return !('gql' in rule) && !('conditions' in rule) && !('resource' in rule)
  }

  async evaluateSingleResource(rule: Rule): Promise<RuleFinding> {
    const finding = {
      id: `${rule.id}/manual`,
      result: Result.SKIPPED,
      typename: 'manual',
      rule,
    } as RuleFinding
    this.findings.push(finding)
    return finding
  }

  prepareMutations(): Entity[] {
    const manualFindings = this.findings.map(({ typename, ...finding }) => ({
      ...finding,
    }))
    return [
      {
        name: `${this.providerName}${this.entityName}Findings`,
        mutation: `
      mutation($input: [Add${this.providerName}${this.entityName}FindingsInput!]!) {
        add${this.providerName}${this.entityName}Findings(input: $input, upsert: true) {
          numUids
        }
      }
      `,
        data: manualFindings,
      },
    ]
  }
}
