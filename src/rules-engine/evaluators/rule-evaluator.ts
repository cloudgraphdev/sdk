import { ResourceData, Rule, RuleFinding } from '../types'

export interface RuleEvaluator<K extends Rule> {
  canEvaluate: (rule: K) => boolean
  evaluateSingleResource: (rule: K, data?: ResourceData) => Promise<RuleFinding>
  // @TODO complex rules can take a query and return an array of resourceId + Result
}
