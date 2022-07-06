import lodash from 'lodash'

import {
  Condition,
  JsonRule,
  Operator,
  ResourceData,
  Result,
  RuleFinding,
  RuleResult,
  _ResourceData,
} from '../types'
import AdditionalOperators from '../operators'
import ComparisonOperators from '../operators/comparison'
import { RuleEvaluator } from './rule-evaluator'

export default class JsonEvaluator implements RuleEvaluator<JsonRule> {
  canEvaluate(rule: JsonRule): boolean {
    return 'conditions' in rule
  }

  async evaluateSingleResource(
    { id, conditions, severity, exclude }: JsonRule,
    data: ResourceData
  ): Promise<RuleFinding> {
    if (exclude && (await this.evaluateCondition(exclude, data))) {
      return
    }
    const result = (await this.evaluateCondition(conditions, data))
      ? RuleResult.MATCHES
      : RuleResult.DOESNT_MATCH

    const finding = {
      id: `${id}/${data.resource?.id}`,
      resourceId: data.resource?.id,
      result: result !== RuleResult.MATCHES ? Result.FAIL : Result.PASS,
      typename: data.resource?.__typename, // eslint-disable-line no-underscore-dangle
      rule: {
        id,
        severity,
      },
    } as RuleFinding
    return finding
  }

  calculatePath = (data: _ResourceData, _path: string) => {
    let path = _path
    if (path.indexOf('@') === 0) {
      // @ means the curr resource, we replace by base path
      path = path.replace('@', data.resourcePath).substr(2) // remove `$.`
    }
    if (path.indexOf('[*]') === 0 && data.elementPath) {
      // @ means the curr resource, we replace by base path
      path = path.replace('[*]', data.elementPath)
    }
    return path
  }

  resolvePath = (data: _ResourceData, path: string): any => {
    return lodash.get(data.data, path)
  }

  operators: { [key: string]: Operator } = {
    not: async (_, conditions: Condition, data) => {
      let notConditions = conditions
      if (data.elementPath) {
        notConditions = { ...conditions, path: data.elementPath }
      }

      return !(await this.evaluateCondition(notConditions, data))
    },
    or: async (_, conditions: Condition[], data) => {
      for (let i = 0; i < conditions.length; i++) {
        // if 1 is true, it's true
        if (await this.evaluateCondition(conditions[i], data)) return true
      }
      return false
    },
    and: async (_, conditions: Condition[], data) => {
      for (let i = 0; i < conditions.length; i++) {
        // if 1 is false, it's false
        if (!(await this.evaluateCondition(conditions[i], data))) return false
      }
      return true
    },
    array_all: async (array = [], conditions: Condition, data) => {
      // an AND, but with every resource item
      const baseElementPath = data.elementPath
      for (let i = 0; i < array.length; i++) {
        if (
          !(await this.evaluateCondition(conditions, {
            ...data,
            elementPath: `${baseElementPath}[${i}]`,
          }))
        )
          return false
      }
      return true
    },
    array_any: async (array = [], conditions, data) => {
      // an OR, but with every resource item
      const baseElementPath = data.elementPath
      for (let i = 0; i < array.length; i++) {
        if (
          await this.evaluateCondition(conditions as Condition, {
            ...data,
            elementPath: `${baseElementPath}[${i}]`,
          })
        )
          return true
      }
      return false
    },
    ...AdditionalOperators,
  }

  isCondition = (a: unknown): boolean =>
    !!a && (a as any).constructor === Object

  async evaluateCondition(
    _condition: Condition,
    _data: _ResourceData
  ): Promise<number | boolean> {
    const condition = { ..._condition }
    const { path, value } = condition
    delete condition.path
    delete condition.value
    // remaining field should be the op name
    const op = Object.keys(condition)[0] //
    const operator = this.operators[op]
    let otherArgs = condition[op] // {[and]: xxx }
    if (!op || !operator) {
      throw new Error(`unrecognized operation${JSON.stringify(condition)}`)
    }

    const data = { ..._data }
    let firstArg

    if (
      Object.keys(ComparisonOperators).includes(operator.name) &&
      this.isCondition(otherArgs) &&
      otherArgs.path
    ) {
      const resourceData = { ..._data }
      const elementPath = this.calculatePath(resourceData, otherArgs.path)
      resourceData.elementPath = elementPath
      otherArgs = this.resolvePath(resourceData, elementPath)
    }

    if (path) {
      const elementPath = this.calculatePath(data, path)
      data.elementPath = elementPath
      firstArg = this.resolvePath(data, elementPath)
    } else if (this.isCondition(value)) {
      firstArg = await this.evaluateCondition(value as any, data)
    } else {
      firstArg = value
    }

    return operator(firstArg, otherArgs, data)
  }
}
