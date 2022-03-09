import cuid from 'cuid'

import RulesProvider from '../src/rules-engine'
import { Engine, Result, Severity } from '../src/rules-engine/types'

const typenameToFieldMap = {
  resourceA: 'querySchemaA',
  resourceB: 'querySchemaB',
}
const providerName = 'aws'
const entityName = 'CIS'

const ruleMock = {
  id: 'id',
  description: 'none',
  title: 'Mocked Rule',
  rationale: "raison d'être",
  audit: 'evaluate schemaA',
  remediation: 'fix the schemaA',
  references: [],
  gql: `{
    querySchemaA {
      id
      __typename
      value
    }
  }`,
  resource: 'querySchemaA[*]',
  conditions: {
    path: '@.value',
    equal: false,
  },
  severity: Severity.HIGH,
}

describe('RulesEngine', () => {
  let rulesEngine: Engine
  beforeAll(() => {
    rulesEngine = new RulesProvider({
      providerName,
      entityName,
      typenameToFieldMap,
    })
  })
  it('Should pass getting the updated schema created dynamically using schemaTypeName and typenameToFieldMap fields', () => {
    const schema = rulesEngine.getSchema()

    expect(schema).toBeDefined()
    expect(schema.length).toBe(Object.keys(typenameToFieldMap).length)

    schema.forEach((resourceSchema, index) => {
      expect(resourceSchema).toContain(Object.keys(typenameToFieldMap)[index])
      expect(resourceSchema).toContain(Object.values(typenameToFieldMap)[index])
    })
  })

  it('Should pass preparing the mutations to insert findings data given a RuleFindings object', () => {
    const resourceId = cuid()
    const data = [
      {
        id: cuid(),
        resourceId,
        result: Result.FAIL,
        typename: 'querySchemaA',
      },
      {
        id: cuid(),
        resourceId,
        result: Result.PASS,
        typename: 'querySchemaA',
      },
    ]

    const [findingsData] = rulesEngine.prepareMutations({
      automatedFindings: data,
      manualFindings: [],
    })

    expect(findingsData).toBeDefined()
    expect(findingsData.name).toBe(`${providerName}${entityName}Findings`)
    expect(findingsData.mutation).toContain(typenameToFieldMap.resourceA)
    expect(findingsData.data.filter).toBeDefined()
    expect(findingsData.data.set).toBeDefined()
    expect(findingsData.data.set[`${entityName}Findings`].length).toBe(
      data.length
    )
  })

  it('Should pass preparing the mutations to insert findings data given a ProcessedFindings object without findings', () => {
    const data = []

    const entities = rulesEngine.prepareMutations({
      automatedFindings: data,
      manualFindings: [],
    })

    expect(entities).toBeDefined()
    expect(entities.length).toBe(3)
  })

  it('Should return an empty array processing a rule with no data', async () => {
    const data = {}

    const processedRule = await rulesEngine.processRule(ruleMock, data)

    expect(processedRule).toBeDefined()
    expect(processedRule instanceof Array).toBeTruthy()
    expect(processedRule.length).toBe(0)
  })
})
