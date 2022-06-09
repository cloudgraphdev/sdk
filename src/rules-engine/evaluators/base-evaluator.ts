import cuid from 'cuid'
import { ResourceData, Result, Rule, RuleFinding } from '../types'
import { RuleEvaluator } from './rule-evaluator'

export default abstract class BaseEvaluator<K extends Rule> implements RuleEvaluator<K>
{
  abstract canEvaluate(rule: K): boolean

  abstract evaluateSingleResource(rule: K, data?: ResourceData): Promise<RuleFinding>

  async evaluateMissingResource({ id, severity, resource }: K): Promise<RuleFinding> {
    return {
      id: `${id}/missing/${cuid()}`,
      resourceId: resource?.replace('[*]', ''),
      result: Result.MISSING,
      typename: 'missing',
      rule: {
        id,
        severity,
      },
    } as RuleFinding
  }
}
