import { Operator } from '../types'

import arrayOperators from './array'
import commonOperators from './common'
import comparisonOperators from './comparison'
import dateOperators from './date'
import regexOperators from './regex'

export default {
  ...arrayOperators,
  ...comparisonOperators,
  ...commonOperators,
  ...dateOperators,
  ...regexOperators,
} as { [key: string]: Operator }
