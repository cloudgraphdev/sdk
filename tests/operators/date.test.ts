import cuid from 'cuid'
import { Result } from '../../src'
import JsonEvaluator from '../../src/rules-engine/evaluators/json-evaluator'

describe('Date Operators', () => {
  let evaluator
  beforeEach(() => {
    evaluator = new JsonEvaluator('aws', 'CIS')
  })

  test('should process dates', async () => {
    const day = 1000 * 60 * 60 * 24 // @TODO - replace by some date library (that is not moment)
    const now = Date.now()
    const data = {
      data: {
        users: [{ passwordDate: new Date(now - 15 * day).toISOString() }],
      },
      resource: {
        id: cuid(),
      },
    } as any
    const rule: any = {
      value: { path: 'users[0].passwordDate', daysAgo: {} },
      lessThan: 10,
    }

    rule.lessThan = 10
    let finding = await evaluator.evaluateSingleResource(
      { conditions: rule } as any,
      data
    )
    expect(finding.result).toBe(Result.FAIL)

    rule.lessThan = 20
    finding = await evaluator.evaluateSingleResource(
      { conditions: rule } as any,
      data
    )
    expect(finding.result).toBe(Result.PASS)
  })

  test('should calculate days diff between two date', async () => {
    const day = 1000 * 60 * 60 * 24 // @TODO - replace by some date library (that is not moment)
    const now = Date.now()
    const data = {
      data: {
        cryptoKeys: [
          { nextRotationTime: new Date(now + 90 * day).toISOString() },
        ],
      },
      resource: {
        id: cuid(),
      },
    } as any
    const rule: any = {
      value: { path: 'cryptoKeys[0].nextRotationTime', daysDiff: {} },
      lessThanInclusive: 90,
    }

    rule.lessThanInclusive = 80
    let finding = await evaluator.evaluateSingleResource(
      { conditions: rule } as any,
      data
    )

    expect(finding.result).toBe(Result.FAIL)

    rule.lessThanInclusive = 90
    finding = await evaluator.evaluateSingleResource(
      { conditions: rule } as any,
      data
    )

    expect(finding.result).toBe(Result.PASS)
  })
})
