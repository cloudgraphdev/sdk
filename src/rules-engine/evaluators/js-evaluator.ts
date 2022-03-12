import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Entity } from '../../types'
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
  private readonly findings: RuleFinding[] = []

  private readonly providerName

  private readonly entityName

  constructor(providerName: string, entityName: string) {
    this.entityName = entityName
    this.providerName = providerName
  }

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
    this.findings.push(finding)
    return finding
  }

  // TODO: Share logic with the JSON evaluator
  prepareMutations(): Entity[] {
    const mutations = []

    // Group Findings by schema type
    const findingsByType = groupBy(this.findings, 'typename')

    for (const findingType in findingsByType) {
      if (!isEmpty(findingType)) {
        // Group Findings by resource
        const findingsByResource = groupBy(
          findingsByType[findingType],
          'resourceId'
        )

        for (const resource in findingsByResource) {
          if (resource) {
            const data = (
              (findingsByResource[resource] as RuleFinding[]) || []
            ).map(({ typename, ...properties }) => properties)

            // Create dynamically update mutations by resource
            const updateMutation = {
              name: `${this.providerName}${this.entityName}Findings`,
              mutation: `mutation update${findingType}($input: Update${findingType}Input!) {
                update${findingType}(input: $input) {
                  numUids
                }
              }
              `,
              data: {
                filter: {
                  id: { eq: resource },
                },
                set: {
                  [`${this.entityName}Findings`]: data,
                },
              },
            }

            mutations.push(updateMutation)
          }
        }
      }
    }

    return mutations
  }
}
