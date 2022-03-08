import { Entity } from '..'

export type ResourceData = {
  data: { [k: string]: any }
  resource: { id: string; [k: string]: any }
  resourcePath: string
}

export type Condition = {
  path?: string
  value?: string | number | Condition | (string | number)[]
  jq?: string
  [operationId: string]: any
}

export type Operator = (
  mainArg: any,
  otherArgs: any[],
  data: ResourceData & { elementPath?: string }
) => boolean | number | Promise<boolean | number>

export type _ResourceData = ResourceData & { elementPath?: string }

export enum Severity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum RuleResult {
  DOESNT_MATCH = 'DOESNT_MATCH',
  MATCHES = 'MATCHES',
  MISSING = 'MISSING',
}

export enum Result {
  FAIL = 'FAIL',
  PASS = 'PASS',
  MISSING = 'MISSING',
  SKIPPED = 'SKIPPED',
}
export interface Rule {
  id: string
  title: string
  description: string
  references: string[]
  rationale?: string
  audit?: string
  remediation?: string
  severity: Severity
  gql: string
  resource: string
  relatedRules?: string[]
}
export interface RuleFinding {
  id: string
  resourceId?: string
  result: Result
  typename: string
}

export interface JsonRule extends Rule {
  conditions: Condition
}

export interface JsRule extends Rule {
  check?: (data: any) => boolean
}

export interface Engine {
  /**
   * Returns an GraphQL schema build dynamically based on the provider and existing resources
   * @returns new schemas and extensions for existing ones
   */
  getSchema: () => string[]

  /**
   * Process a rule for the given data
   * @param rule rule to apply
   * @param data data to evaluate
   * @returns An array of RuleFinding
   */
  processRule: (rule: Rule, data: any) => Promise<RuleFinding[]>

  /**
   * Transforms RuleFinding array into a mutation array for GraphQL
   * @param findings resulted findings during rules execution
   * @returns Array of generated mutations
   */
  prepareMutations: (findings: RuleFinding[]) => Entity[]
}
