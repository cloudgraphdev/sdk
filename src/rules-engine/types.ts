import { ProviderData } from '..'

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

export interface Rule {
  id: string
  description: string
  rationale?: string
  gql: string
  resource: string
}

export enum Result {
  FAIL = 'FAIL',
  PASS = 'PASS',
  MISSING = 'MISSING',
}

export interface RuleFinding {
  id: string
  ruleId: string
  resourceId: string
  result: Result
  [key: string]: any
}

export interface JsonRule extends Rule {
  conditions: Condition
}

export interface JsRule extends Rule {
  check?: (data: any) => boolean
}

export enum severity {
  warning = 'Warning',
  danger = 'Danger',
}

export enum RuleResult {
  DOESNT_MATCH = 'DOESNT_MATCH',
  MATCHES = 'MATCHES',
  MISSING = 'MISSING',
}

export interface Engine {
  processRule: (rule: Rule, data: any) => Promise<RuleFinding[]>
  getData: (findings: RuleFinding[]) => Promise<ProviderData>
  getSchema: () => string[]
}
