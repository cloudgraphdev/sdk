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
  rationale: string
  gql: string
  resource: string
}

export interface RuleFinding {
  id: string
  ruleId: string
  ruleDescription: string
  resourceId: string
  result: 'FAIL' | 'PASS' | 'MISSING'
  [key: string]: any
}

export interface JsonRule extends Rule {
  conditions: Condition
}

export interface JsRule extends Rule {
  check?: (data: any) => boolean
}

export enum RuleResult {
  DOESNT_MATCH = 'DOESNT_MATCH',
  MATCHES = 'MATCHES',
  MISSING = 'MISSING',
}
