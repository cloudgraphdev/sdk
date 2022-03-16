import { Entity } from '../../types'
import { RuleFinding } from '../types'

export default interface DataProcessor {
  /**
   * Transforms RuleFinding array into a mutation array for GraphQL
   * @param findings resulted findings during rules execution
   * @returns {Entity[]} Array of generated mutations
   */
  prepareMutations: (findings: RuleFinding[]) => Entity[]
}
