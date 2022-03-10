// Common Operators
export default {
  isEmpty: (data, shouldBeEmpty) => {
    if (Array.isArray(data)) {
      // Verify empty/filled arrays
      const array = (data || []).length
      return shouldBeEmpty ? array === 0 : array > 0
    }

    // Verify empty/filled objects
    if (typeof data === 'object') {
      const hasKeys = Object.keys(data).length
      return shouldBeEmpty ? hasKeys === 0 : hasKeys > 0
    }

    return false
  },
}
