import { Operator } from '../types'

import arrayOperators from './array'
import comparisonOperators from './comparison'
import dateOperators from './date'

export default {
  ...comparisonOperators,
  ...arrayOperators,
  ...dateOperators,
} as { [key: string]: Operator }
