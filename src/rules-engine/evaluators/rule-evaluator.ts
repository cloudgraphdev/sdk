import { Entity } from '../../types'
import { ResourceData, Rule, RuleFinding } from '../types'

export interface RuleEvaluator<K extends Rule> {
  canEvaluate: (rule: K) => boolean
  evaluateSingleResource: (rule: K, data?: ResourceData) => Promise<RuleFinding>
  prepareMutations: () => Entity[]
}
