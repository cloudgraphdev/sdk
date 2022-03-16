import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Entity } from '../../types'
import { RuleFinding } from '../types'
import DataProcessor from './data-processor'

export default class DgraphDataProcessor implements DataProcessor {
  private readonly providerName

  private readonly entityName

  constructor(providerName: string, entityName: string) {
    this.providerName = providerName
    this.entityName = entityName
  }

  /**
   * Prepare the mutations for overall provider findings
   * @param findings RuleFinding array
   * @returns A formatted Entity array
   */
  private prepareProviderMutations = (
    findings: RuleFinding[] = []
  ): Entity[] => {
    // Prepare provider schema connections
    return [
      {
        name: `${this.providerName}Findings`,
        mutation: `
        mutation($input: [Add${this.providerName}FindingsInput!]!) {
          add${this.providerName}Findings(input: $input, upsert: true) {
            numUids
          }
        }
        `,
        data: {
          id: `${this.providerName}-provider`,
        },
      },
      {
        name: `${this.providerName}Findings`,
        mutation: `mutation update${this.providerName}Findings($input: Update${this.providerName}FindingsInput!) {
            update${this.providerName}Findings(input: $input) {
              numUids
            }
          }
          `,
        data: {
          filter: {
            id: { eq: `${this.providerName}-provider` },
          },
          set: {
            [`${this.entityName}Findings`]: findings.map(
              ({ typename, ...rest }) => ({ ...rest })
            ),
          },
        },
      },
    ]
  }

  private prepareProcessedMutations(findingsByType: {
    [resource: string]: RuleFinding[]
  }): Entity[] {
    const mutations = []

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

  private prepareManualMutations(findings: RuleFinding[] = []): Entity[] {
    const manualFindings = findings.map(({ typename, ...finding }) => ({
      ...finding,
    }))
    return manualFindings.length > 0
      ? [
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
      : []
  }

  // TODO: Optimize generated mutations number
  prepareMutations = (findings: RuleFinding[] = []): Entity[] => {
    // Group Findings by schema type
    const { manual, ...processedRules } = groupBy(findings, 'typename')

    // Prepare processed rules mutations
    const processedRulesData = this.prepareProcessedMutations(processedRules)

    // Prepare manual mutations
    const manualRulesData = this.prepareManualMutations(manual)

    // Prepare provider mutations
    const providerData = this.prepareProviderMutations(findings)

    return [...manualRulesData, ...processedRulesData, ...providerData]
  }
}
