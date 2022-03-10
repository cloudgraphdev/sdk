// Array Operators
export default {
  in: (a, b) => (Array.isArray(b) ? b.indexOf(a) > -1 : false),
  notIn: (a, b) => (Array.isArray(b) ? b.indexOf(a) === -1 : false),
  contains: (a, b) => (Array.isArray(a) ? a.indexOf(b) > -1 : false),
  doesNotContain: (a, b) => (Array.isArray(a) ? a.indexOf(b) === -1 : false),
}
