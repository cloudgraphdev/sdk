import { ResourceData, Rule, RuleResult } from '../types'

export interface RuleEvaluator<K extends Rule> {
  canEvaluate: (rule: K) => boolean
  evaluateSingleResource: (rule: K, data: ResourceData) => Promise<RuleResult>
  // @TODO complex rules can take a query and return an array of resourceId + Result
}
