import JsonEvaluator from '../../src/rules-engine/evaluators/json-evaluator'
import { RuleResult } from '../../src/rules-engine/types'

describe('Date Operators', () => {
  let evaluator
  beforeEach(() => {
    evaluator = new JsonEvaluator()
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

  test('should calculate days diff between two date', async () => {
    const day = 1000 * 60 * 60 * 24 // @TODO - replace by some date library (that is not moment)
    const now = Date.now()
    const data = {
      data: {
        cryptoKeys: [{ nextRotationTime: new Date(now + 90 * day).toISOString() }],
      },
    } as any
    const rule: any = {
      value: { path: 'cryptoKeys[0].nextRotationTime', daysDiff: {} },
      lessThanInclusive: 90,
    }

    rule.lessThanInclusive = 80
    expect(
      await evaluator.evaluateSingleResource({ conditions: rule } as any, data)
    ).toBe(RuleResult.DOESNT_MATCH)

    rule.lessThanInclusive = 90
    expect(
      await evaluator.evaluateSingleResource({ conditions: rule } as any, data)
    ).toBe(RuleResult.MATCHES)
  })
})
