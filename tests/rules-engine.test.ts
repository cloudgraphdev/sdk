import cuid from 'cuid'

import RulesProvider from '../src/rules-engine'
import { Engine, Result, Severity } from '../src/rules-engine/types'

const typenameToFieldMap = {
  resourceA: 'querySchemaA',
  resourceB: 'querySchemaB',
}
const schemaTypeName = 'providerFindings'

const ruleMock = {
  id: 'id',
  description: 'none',
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
  severity: Severity.DANGER,
}

describe('RulesEngine', () => {
  let rulesEngine: Engine
  beforeAll(() => {
    rulesEngine = new RulesProvider(typenameToFieldMap, schemaTypeName)
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

  it('Should pass preparing the mutations to insert findings data given a RuleFindings array', () => {
    const data = [
      {
        id: cuid(),
        ruleId: cuid(),
        resourceId: cuid(),
        result: Result.FAIL,
        severity: Severity.WARNING,
      },
      {
        id: cuid(),
        ruleId: cuid(),
        resourceId: cuid(),
        result: Result.PASS,
        severity: Severity.DANGER,
      },
      {
        id: cuid(),
        ruleId: cuid(),
        resourceId: cuid(),
        result: Result.MISSING,
        severity: Severity.WARNING,
      },
    ]

    const {
      entities: [findingsData],
    } = rulesEngine.getData(data)

    expect(findingsData).toBeDefined()
    expect(findingsData.name).toBe(schemaTypeName)
    expect(findingsData.mutation).toContain(schemaTypeName)
    expect(findingsData.data.length).toBe(data.length)
  })

  it('Should pass preparing the mutations to insert findings data given an empty RuleFindings array', () => {
    const data = []

    const {
      entities: [findingsData],
    } = rulesEngine.getData(data)

    expect(findingsData).toBeDefined()
    expect(findingsData.name).toBe(schemaTypeName)
    expect(findingsData.mutation).toContain(schemaTypeName)
    expect(findingsData.data.length).toBe(data.length)
  })

  it('Should return an empty array processing a rule with no data', async () => {
    const data = {}

    const processedRule = await rulesEngine.processRule(ruleMock, data)

    expect(processedRule).toBeDefined()
    expect(processedRule instanceof Array).toBeTruthy()
    expect(processedRule.length).toBe(0)
  })
})
