// Regex Operators
export default {
  match: (a, b) => new RegExp(a).test(b),
  mismatch: (a, b) => !new RegExp(a).test(b),
}
