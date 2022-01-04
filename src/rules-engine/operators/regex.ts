// Regex Operators
export default {
  match: (a, b) => new RegExp(b).test(a),
  mismatch: (a, b) => !new RegExp(b).test(a),
}
