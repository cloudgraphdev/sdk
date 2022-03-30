import { Entity } from '../../types'
import { RuleFinding } from '../types'

export default interface DataProcessor {
  readonly typenameToFieldMap: { [typeName: string]: string }

  readonly extraFields: string[]

  /**
   * Returns an GraphQL schema build dynamically based on the provider and existing resources
   * @returns new schemas and extensions for existing ones
   */
  getSchema: () => string[]

  /**
   * Transforms RuleFinding array into a mutation array for GraphQL
   * @param findings resulted findings during rules execution
   * @returns {Entity[]} Array of generated mutations
   */
  prepareMutations: (findings: RuleFinding[]) => Entity[]
}
