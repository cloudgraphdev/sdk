import cuid from 'cuid'
import ManualEvaluator from '../src/rules-engine/evaluators/manual-evaluator'

describe('ManualEvaluator', () => {
  let evaluator
  beforeAll(() => {
    evaluator = new ManualEvaluator()
  })

  it('should pass when it does not contain gql, conditions, check, and resource fields', () => {
    expect(
      evaluator.canEvaluate({
        id: '',
        description: '',
        rationale: '',
        autid: '',
        remediation: '',
        references: [],
        severity: '',
      } as never)
    ).toBe(true)
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
    expect(finding.result).toEqual('SKIPPED')
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
})
