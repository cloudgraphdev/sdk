// Date Operators
export default {
  daysAgo: a =>
    Math.trunc((Date.now() - new Date(a).getTime()) / (60 * 60 * 1000 * 24)), // @TODO use library
}
