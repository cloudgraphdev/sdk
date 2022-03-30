import groupBy from 'lodash/groupBy'
import isEmpty from 'lodash/isEmpty'
import { Entity } from '../../types'
import { Rule, RuleFinding } from '../types'
import DataProcessor from './data-processor'

export default class DgraphDataProcessor implements DataProcessor {
  private readonly providerName

  private readonly entityName

  readonly typenameToFieldMap: { [typeName: string]: string }

  readonly extraFields: string[]

  constructor({
    providerName,
    entityName,
    typenameToFieldMap,
    extraFields,
  }: {
    providerName: string
    entityName: string
    typenameToFieldMap?: { [tn: string]: string }
    extraFields?: string[]
  }) {
    this.providerName = providerName
    this.entityName = entityName
    this.extraFields = extraFields ?? []
    this.typenameToFieldMap = typenameToFieldMap ?? {}
  }

  getSchema = (): string[] => {
    const mainType = `
    enum FindingsResult {
      PASS
      FAIL
      MISSING
      SKIPPED
    }

    type ${this.providerName}Findings @key(fields: "id") {
      id: String! @id
      ${this.entityName}Findings: [${this.providerName}${
      this.entityName
    }Findings]
    }

    type ruleMetadata @key(fields: "id") {
      id: String! @id @search(by: [hash, regexp])
      severity: String @search(by: [hash, regexp])
      description: String! @search(by: [hash, regexp])
      title: String @search(by: [hash, regexp])
      audit: String @search(by: [hash, regexp])
      rationale: String @search(by: [hash, regexp])
      remediation: String @search(by: [hash, regexp])
      references: [String] @search(by: [hash, regexp])
      findings: [baseFinding] @hasInverse(field: rule)
    }

    interface baseFinding {
      id: String! @id
      resourceId: String @search(by: [hash, regexp])
      rule: [ruleMetadata] @hasInverse(field: findings)
      result: FindingsResult @search
    }

    type ${this.providerName}${
      this.entityName
    }Findings implements baseFinding @key(fields: "id") {
      findings: ${this.providerName}Findings  @hasInverse(field: ${
      this.entityName
    }Findings)
      # extra fields
      ${this.extraFields.map(
        field => `${field}: String @search(by: [hash, regexp])`
      )}
      # connections
       ${Object.keys(this.typenameToFieldMap)
         .map(
           (tn: string) =>
             `${tn}: [${this.typenameToFieldMap[tn]}] @hasInverse(field: ${this.entityName}Findings)`
         )
         .join(' ')}
    }
      `
    const extensions = Object.keys(this.typenameToFieldMap)
      .map(
        (tn: string) =>
          `extend type ${this.typenameToFieldMap[tn]} {
   ${this.entityName}Findings: [${this.providerName}${this.entityName}Findings] @hasInverse(field: ${tn})
}`
      )
      .join('\n')

    return [mainType, extensions]
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
    return findings?.length > 0
      ? [
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
      : []
  }

  private prepareEntitiesMutations(findings: RuleFinding[]): RuleFinding[] {
    // Group Findings by schema type
    const { manual: manualData = [], ...processedRules } = groupBy(
      findings,
      'typename'
    )

    const mutations = [...manualData]
    for (const findingType in processedRules) {
      if (!isEmpty(findingType)) {
        // Group Findings by resource
        const findingsByResource = groupBy(
          processedRules[findingType],
          'resourceId'
        )

        for (const resource in findingsByResource) {
          if (resource) {
            const data = (
              (findingsByResource[resource] as RuleFinding[]) || []
            ).map(finding => {
              const resourceType = Object.keys(this.typenameToFieldMap).find(
                key => this.typenameToFieldMap[key] === finding.typename
              )

              return {
                ...finding,
                [resourceType]: {
                  id: resource,
                },
              }
            })

            mutations.push(...data)
          }
        }
      }
    }

    return mutations
  }

  prepareRulesMetadataMutations = (rules: Rule[] = []): Entity[] => {
    return [
      {
        name: 'ruleMetadata',
        mutation: `
mutation($input: [AddruleMetadataInput!]!) {
addruleMetadata(input: $input, upsert: true) {
  numUids
}
}

`,
        data: rules.map(
          ({
            id,
            title,
            description,
            references,
            rationale,
            audit,
            remediation,
            severity,
          }) => ({
            id,
            title,
            description,
            references,
            rationale,
            audit,
            remediation,
            severity,
          })
        ),
      },
    ]
  }

  prepareFindingsMutations = (findings: RuleFinding[] = []): Entity[] => {
    // Return an empty array if there are no findings
    if (isEmpty(findings)) {
      return []
    }

    // Prepare entities mutations
    const entitiesData = this.prepareEntitiesMutations(findings).map(
      ({ typename, ...finding }) => ({
        ...finding,
      })
    )

    // Prepare provider mutations
    const providerData = this.prepareProviderMutations(findings)

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
        data: entitiesData,
      },
      ...providerData,
    ]
  }
}
