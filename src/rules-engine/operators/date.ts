import { differenceInDays } from 'date-fns'

// Date Operators
export default {
  daysAgo: a => differenceInDays(Date.now(), new Date(a)),
}
