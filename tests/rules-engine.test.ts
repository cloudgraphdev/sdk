import RulesProvider from '../src/rules-engine'
import { Engine, Result, Rule } from '../src/rules-engine/types'
import ManualEvaluatorMock from './evaluators/manual-evaluator.test'
import JSONEvaluatordMock from './evaluators/json-evaluator.test'
import DgraphDataProcessor from '../src/rules-engine/data-processors/dgraph-data-processor'
import { RuleFinding } from '../src'

const typenameToFieldMap = {
  resourceA: 'querySchemaA',
  resourceB: 'querySchemaB',
}
const providerName = 'aws'
const entityName = 'CIS'

describe('RulesEngine', () => {
  let rulesEngine: Engine
  beforeEach(() => {
    const dataProcessor = new DgraphDataProcessor({
      providerName,
      entityName,
      typenameToFieldMap,
    })
    rulesEngine = new RulesProvider(dataProcessor)
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
    const findings = await rulesEngine.processRule(
      ManualEvaluatorMock.manualRule as Rule,
      undefined
    )
    const [mutations] = rulesEngine.prepareMutations(findings, [])

    expect(findings.length).toBe(1)
    expect(mutations).toBeDefined()
    expect(mutations.data instanceof Array).toBeTruthy()
    expect(mutations.data.length).toBe(1)
    expect(mutations.name).toBe(`${providerName}${entityName}Findings`)
    expect(mutations.mutation).toContain(
      `add${providerName}${entityName}Findings`
    )
  })

  it('Should return a missing finding type processing a rule with no data', async () => {
    const data = {}

    const processedRule = await rulesEngine.processRule(
      JSONEvaluatordMock.jsonRule,
      data
    ) as RuleFinding[]

    expect(processedRule).toBeDefined()
    expect(processedRule.length).toBe(1)
    expect(processedRule[0].result).toBe(Result.MISSING)
  })

  it('Should return empty mutations array given an empty findings array', () => {
    const data = []

    const entities = rulesEngine.prepareMutations(data, [])

    expect(entities).toBeDefined()
    expect(entities.length).toBe(0)
  })
})
