import cuid from 'cuid'

import RulesProvider from '../src/rules-engine'
import { Engine, Rule } from '../src/rules-engine/types'
import ManualEvaluatorMock from './evaluators/manual-evaluator.test'
import JSONEvaluatordMock from './evaluators/json-evaluator.test'

const typenameToFieldMap = {
  resourceA: 'querySchemaA',
  resourceB: 'querySchemaB',
}
const providerName = 'aws'
const entityName = 'CIS'

describe('RulesEngine', () => {
  let rulesEngine: Engine
  beforeEach(() => {
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

  it('Should pass preparing the mutations to insert findings data given a RuleFindings array with Manual Rules', async () => {
    await rulesEngine.processRule(
      ManualEvaluatorMock.manualRule as Rule,
      undefined
    )
    const findings = rulesEngine.prepareMutations([])
    const [mutations] = findings

    expect(findings.length).toBe(3)
    expect(mutations).toBeDefined()
    expect(mutations.data instanceof Array).toBeTruthy()
    expect(mutations.data.length).toBe(1)
    expect(mutations.name).toBe(`${providerName}${entityName}Findings`)
    expect(mutations.mutation).toContain(
      `add${providerName}${entityName}Findings`
    )
  })

  it('Should pass preparing the mutations to insert findings data given a RuleFindings array with Automated Rules', async () => {
    const resourceId = cuid()
    const resourceType = 'schemaA'
    await rulesEngine.processRule(JSONEvaluatordMock.jsonRule as Rule, {
      querySchemaA: [
        {
          id: resourceId,
          __typename: resourceType,
          value: 'automated',
        },
      ],
    })
    const findings = rulesEngine.prepareMutations([])
    const [mutations] = findings

    expect(findings.length).toBe(4)
    expect(mutations).toBeDefined()
    expect(mutations.data instanceof Object).toBeTruthy()
    expect(mutations.data.filter.id.eq).toBe(resourceId)
    expect(mutations.name).toBe(`${providerName}${entityName}Findings`)
    expect(mutations.mutation).toContain(`update${resourceType}`)
  })

  it('Should pass preparing the mutations to insert with an empty findings array', () => {
    const data = []

    const entities = rulesEngine.prepareMutations(data)

    expect(entities).toBeDefined()
    expect(entities.length).toBe(3)
  })

  it('Should return an empty array processing a rule with no data', async () => {
    const data = {}

    const processedRule = await rulesEngine.processRule(
      JSONEvaluatordMock.jsonRule,
      data
    )

    expect(processedRule).toBeDefined()
    expect(processedRule instanceof Array).toBeTruthy()
    expect(processedRule.length).toBe(0)
  })
})
