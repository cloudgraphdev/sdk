// Regex Operators
export default {
  match: (a, b) => new RegExp(b).test(a),
  mismatch: (a, b) => !new RegExp(b).test(a),
  matchAny: (a, b) => {
    if (Array.isArray(a)) {
      const result = a
        .map(value =>
          typeof value === 'string' ? !new RegExp(b).test(value) : undefined
        )
        .some(v => v)
      return result
    }

    return false
  },
}
