import cuid from 'cuid'
import JsEvaluator from '../src/rules-engine/evaluators/js-evaluator'

describe('JsEvaluator', () => {
  it('should accept all rules that have a check field', () => {
    const e = new JsEvaluator()

    expect(e.canEvaluate({} as never)).toBe(false)
    expect(e.canEvaluate({ checks: 1 } as never)).toBe(false)

    // we could improve these, but following tests will pass
    expect(e.canEvaluate({ check: 1 } as never)).toBe(true)
    expect(e.canEvaluate({ check: 0 } as never)).toBe(true)
    expect(e.canEvaluate({ check: () => 1 } as never)).toBe(true)
  })

  it('should call check with data', () => {
    const e = new JsEvaluator()
    const spy = jest.fn()
    const data = 'asdf'
    e.evaluateSingleResource({ check: spy } as never, data as never)

    expect(spy).toHaveBeenCalledWith(data)
  })

  it('should return fail if rule is true', async () => {
    const e = new JsEvaluator()
    const spy = jest.fn()
    spy.mockReturnValue(false)
    const failedRule = await e.evaluateSingleResource(
      { check: spy } as never,
      { resource: { id: cuid() } } as never
    )
    expect(failedRule.result).toEqual('FAIL')
    spy.mockReturnValue(true)
    const passedRule = await e.evaluateSingleResource(
      { check: spy } as never,
      { resource: { id: cuid() } } as never
    )
    expect(passedRule.result).toEqual('PASS')
  })
})
