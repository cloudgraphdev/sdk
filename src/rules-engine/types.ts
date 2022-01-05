import { Entity } from '..'

export type ResourceData = {
  data: { [k: string]: any }
  resource: { id: string; [k: string]: any }
  resourcePath: string
}

export type Condition = {
  path?: string
  value?: string | number | Condition | (string | number)[]
  [operationId: string]: any
}

export type Operator = (
  mainArg: any,
  otherArgs: any[],
  data: ResourceData & { elementPath?: string }
) => boolean | number

export type _ResourceData = ResourceData & { elementPath?: string }

export enum Severity {
  WARNING = 'warning',
  DANGER = 'danger',
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
}
export interface Rule {
  id: string
  description: string
  rationale?: string
  gql: string
  resource: string
  severity: Severity
}

export interface RuleFinding {
  id: string
  ruleId: string
  resourceId: string
  result: Result
  severity: Severity
  description: string
  typename: string
}

export interface JsonRule extends Rule {
  conditions: Condition
}

export interface JsRule extends Rule {
  check?: (data: any) => boolean
}

export interface Engine {
  processRule: (rule: Rule, data: any) => Promise<RuleFinding[]>
  prepareEntitiesMutations: (findings: RuleFinding[]) => Entity[]
  prepareProviderMutations: (findings: RuleFinding[]) => Entity[]
  getSchema: () => string[]
}
