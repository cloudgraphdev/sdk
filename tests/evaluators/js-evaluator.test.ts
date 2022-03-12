import cuid from 'cuid'
import { Result } from '../../src'
import JsEvaluator from '../../src/rules-engine/evaluators/js-evaluator'
import { Severity } from '../../src/rules-engine/types'

const providerName = 'azure'
const entityName = 'CIS'
const jsRule = {
  id: cuid(),
  description: 'none',
  title: 'Mocked Automated Rule',
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
  check: jest.fn(),
  severity: Severity.HIGH,
}

export default {
  jsRule,
}

describe('JsEvaluator', () => {
  let evaluator
  beforeEach(() => {
    evaluator = new JsEvaluator(providerName, entityName)
  })

  it('should accept all rules that have a check field', () => {
    expect(evaluator.canEvaluate({} as never)).toBe(false)
    expect(evaluator.canEvaluate({ checks: 1 } as never)).toBe(false)

    // we could improve these, but following tests will pass
    expect(evaluator.canEvaluate({ check: 1 } as never)).toBe(true)
    expect(evaluator.canEvaluate({ check: 0 } as never)).toBe(true)
    expect(evaluator.canEvaluate({ check: () => 1 } as never)).toBe(true)
  })

  it('should call check with data', () => {
    const spy = jest.fn()
    const data = 'asdf'
    evaluator.evaluateSingleResource({ check: spy } as never, data as never)

    expect(spy).toHaveBeenCalledWith(data)
  })

  it('should return fail if rule is true', async () => {
    const spy = jest.fn()
    spy.mockReturnValue(false)
    const failedRule = await evaluator.evaluateSingleResource(
      { check: spy } as never,
      { resource: { id: cuid() } } as never
    )
    expect(failedRule.result).toEqual(Result.FAIL)
    spy.mockReturnValue(true)
    const passedRule = await evaluator.evaluateSingleResource(
      { check: spy } as never,
      { resource: { id: cuid() } } as never
    )
    expect(passedRule.result).toEqual(Result.PASS)
  })

  it('should return a processed rules mutations array', async () => {
    const resourceId = cuid()
    const resourceType = 'schemaA'
    await evaluator.evaluateSingleResource(jsRule, {
      resource: {
        id: resourceId,
        __typename: resourceType,
        value: 'automated',
      },
    })
    const mutations = evaluator.prepareMutations()
    const [atuomatedMutation] = mutations

    expect(mutations.length).toBe(1)
    expect(atuomatedMutation).toBeDefined()
    expect(atuomatedMutation.data instanceof Object).toBeTruthy()
    expect(atuomatedMutation.data.filter.id.eq).toBe(resourceId)
    expect(atuomatedMutation.name).toBe(`${providerName}${entityName}Findings`)
    expect(atuomatedMutation.mutation).toContain(`update${resourceType}`)
  })
})
