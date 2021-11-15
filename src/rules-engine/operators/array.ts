// Array Operators
export default {
  in: (a, b) => (Array.isArray(b) ? b.indexOf(a) > -1 : false),
  notIn: (a, b) => (Array.isArray(b) ? b.indexOf(a) === -1 : false),
  contains: (a, b) => (Array.isArray(a) ? a.indexOf(b) > -1 : false),
  doesNotContain: (a, b) => (Array.isArray(a) ? a.indexOf(b) === -1 : false),
  isEmpty: (data, shouldBeEmpty) => {
    if (Array.isArray(data)) {
      // Verify empty/filled arrays
      const array = (data || []).length
      return shouldBeEmpty ? array === 0 : array > 0
    }

    return false
  },
}
