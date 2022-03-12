import cuid from 'cuid'
import { Result } from '../../src'
import ManualEvaluator from '../../src/rules-engine/evaluators/manual-evaluator'
import { Severity } from '../../src/rules-engine/types'

const providerName = 'gcp'
const entityName = 'CIS'
const manualRule = {
  id: cuid(),
  description: 'none',
  title: 'Mocked Manual Rule',
  rationale: 'Ikigai',
  audit: 'evaluate schemaA',
  remediation: 'fix the schemaA',
  references: [],
  severity: Severity.HIGH,
}
export default {
  manualRule,
}

describe('ManualEvaluator', () => {
  let evaluator
  beforeEach(() => {
    evaluator = new ManualEvaluator(providerName, entityName)
  })

  it('should pass when it does not contain gql, conditions, check, and resource fields', () => {
    expect(evaluator.canEvaluate(manualRule)).toBe(true)
  })

  it('should fail when it contains gql, conditions, check, or resource fields', () => {
    // Fail with resource field
    expect(evaluator.canEvaluate({ resource: '' } as never)).toBe(false)
    // Fail with gql field
    expect(evaluator.canEvaluate({ gql: '' } as never)).toBe(false)
    // Fail with conditions field
    expect(evaluator.canEvaluate({ conditions: {} } as never)).toBe(false)
  })

  it('should return skipped as result', async () => {
    const spy = jest.fn()
    spy.mockReturnValue(false)
    const finding = await evaluator.evaluateSingleResource(
      { check: spy } as never,
      { resource: { id: cuid() } } as never
    )
    expect(finding.result).toEqual(Result.SKIPPED)
  })

  it('should contain "manual" at the id', async () => {
    const spy = jest.fn()
    spy.mockReturnValue(false)
    const finding = await evaluator.evaluateSingleResource(
      { check: spy } as never,
      { resource: { id: cuid() } } as never
    )
    expect(finding.id.includes('manual')).toEqual(true)
  })

  it('should return a manual mutations array', async () => {
    await evaluator.evaluateSingleResource(manualRule)
    const mutations = evaluator.prepareMutations()
    const [manualMutation] = mutations

    expect(mutations.length).toBe(1)
    expect(manualMutation.name).toBe(`${providerName}${entityName}Findings`)
    expect(manualMutation.data.length).toBe(1)
    expect(manualMutation.mutation).toContain(
      `add${providerName}${entityName}Findings`
    )
  })
})
