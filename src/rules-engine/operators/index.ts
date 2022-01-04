import { Operator } from '../types'

import arrayOperators from './array'
import comparisonOperators from './comparison'
import dateOperators from './date'
import regexOperators from './regex'

export default {
  ...comparisonOperators,
  ...arrayOperators,
  ...dateOperators,
  ...regexOperators,
} as { [key: string]: Operator }
