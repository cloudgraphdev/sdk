import JsonEvaluator from '../src/rules-engine/evaluators/json-evaluator'
import { RuleResult } from '../src/rules-engine/types'

describe('JsonEvaluator', () => {
  let evaluator
  beforeEach(() => {
    evaluator = new JsonEvaluator()
  })

  test('should accept all rules that have a conditions field', () => {
    expect(evaluator.canEvaluate({} as any)).toBe(false)
    expect(evaluator.canEvaluate({ conditionss: 1 } as any)).toBe(false)
    expect(evaluator.canEvaluate({ conditions: 1 } as any)).toBe(true)
  })

  test('should execute simple rules', async () => {
    const data = {
      a: 1,
      b: '1',
      c: { d: 'hello' },
      e: ['a', 'b'],
    }
    const rules = [
      { path: 'a', equal: 1, expected: true },
      { path: 'a', equal: '1', expected: true },
      { path: 'a', equal: '2', expected: false },
      { path: 'b', equal: 1, expected: true },
      { path: 'b', equal: '1', expected: true },
      { path: 'c', notEqual: 'a', expected: true },
      { path: 'a', notEqual: 1, expected: false },
      { path: 'a', in: [1, 2, 3], expected: true },
      { path: 'a', in: [9, 10], expected: false },
      { path: 'a', notIn: [2, 3], expected: true },
      { path: 'a', notIn: [2, 1], expected: false },
      { path: 'e', doesNotContain: 'hello', expected: true },
      { path: 'e', doesNotContain: 'a', expected: false },
    ]
    const results = []
    const expected = []
    for (const r of rules) {
      const res = await evaluator.evaluateSingleResource(
        { conditions: r } as any,
        { data } as any
      )
      results.push(res)
      expected.push(r.expected ? RuleResult.MATCHES : RuleResult.DOESNT_MATCH)
    }
    expect(results).toStrictEqual(expected)
  })

  test('should combine simple rules [and,or]', async () => {
    const data = {
      a: 1,
      b: 2,
    }
    const trueRule = { path: 'a', equal: 1 }
    const falseRule = { path: 'a', equal: 99 }
    expect(
      await evaluator.evaluateSingleResource(
        { conditions: { and: [trueRule, trueRule, trueRule] } } as any,
        { data } as any
      )
    ).toBe(RuleResult.MATCHES)
    expect(
      await evaluator.evaluateSingleResource(
        { conditions: { and: [trueRule, trueRule, falseRule] } } as any,
        { data } as any
      )
    ).toBe(RuleResult.DOESNT_MATCH)

    expect(
      await evaluator.evaluateSingleResource(
        { conditions: { or: [falseRule, falseRule, falseRule] } } as any,
        { data } as any
      )
    ).toBe(RuleResult.DOESNT_MATCH)
    expect(
      await evaluator.evaluateSingleResource(
        { conditions: { or: [falseRule, trueRule, falseRule] } } as any,
        { data } as any
      )
    ).toBe(RuleResult.MATCHES)

    // nested
    expect(
      await evaluator.evaluateSingleResource(
        {
          conditions: {
            or: [falseRule, falseRule, { and: [trueRule, trueRule] }],
          },
        } as any,
        { data } as any
      )
    ).toBe(RuleResult.MATCHES)

    expect(
      await evaluator.evaluateSingleResource(
        {
          conditions: {
            or: [falseRule, falseRule, { and: [trueRule, falseRule] }],
          },
        } as any,
        { data } as any
      )
    ).toBe(RuleResult.DOESNT_MATCH)
  })

  test('should resolve paths', async () => {
    const data = { data: { a: { b: [0, { d: 'value' }] } } } as any
    const rule = { path: 'xx', equal: 'value' }

    rule.path = 'a.b[1].d'
    expect(
      await evaluator.evaluateSingleResource({ conditions: rule } as any, data)
    ).toBe(RuleResult.MATCHES)
    rule.path = 'a.b[0].d'
    expect(
      await evaluator.evaluateSingleResource({ conditions: rule } as any, data)
    ).toBe(RuleResult.DOESNT_MATCH)

    // @ is replaced by the resource path
    data.resourcePath = '$.a.b[1]'
    rule.path = '@.d'
    expect(
      await evaluator.evaluateSingleResource({ conditions: rule } as any, data)
    ).toBe(RuleResult.MATCHES)

    data.resourcePath = '$.a'
    rule.path = '@.b[1].d'
    expect(
      await evaluator.evaluateSingleResource({ conditions: rule } as any, data)
    ).toBe(RuleResult.MATCHES)
  })

  test('should support array operators', async () => {
    const data = { data: { a: { b: [0, 1, 2] } } } as any
    let rule: any = { path: 'a.b', array_any: { path: '[*]', equal: 2 } }

    expect(
      await evaluator.evaluateSingleResource({ conditions: rule } as any, data)
    ).toBe(RuleResult.MATCHES)

    //
    rule = { path: 'a.b', array_all: { path: '[*]', equal: 2 } }
    expect(
      await evaluator.evaluateSingleResource({ conditions: rule } as any, data)
    ).toBe(RuleResult.DOESNT_MATCH)

    rule = { path: 'a.b', array_all: { path: '[*]', greaterThan: -1 } }
    expect(
      await evaluator.evaluateSingleResource({ conditions: rule } as any, data)
    ).toBe(RuleResult.MATCHES)
  })

  test('should process dates', async () => {
    const day = 1000 * 60 * 60 * 24 // @TODO - replace by some date library (that is not moment)
    const now = Date.now()
    const data = {
      data: {
        users: [{ passwordDate: new Date(now - 15 * day).toISOString() }],
      },
    } as any
    const rule: any = {
      value: { path: 'users[0].passwordDate', daysAgo: {} },
      lessThan: 10,
    }

    rule.lessThan = 10
    expect(
      await evaluator.evaluateSingleResource({ conditions: rule } as any, data)
    ).toBe(RuleResult.DOESNT_MATCH)

    rule.lessThan = 20
    expect(
      await evaluator.evaluateSingleResource({ conditions: rule } as any, data)
    ).toBe(RuleResult.MATCHES)
  })
})
