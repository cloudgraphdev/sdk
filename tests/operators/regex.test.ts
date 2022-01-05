import RegexOperators from '../../src/rules-engine/operators/regex'

describe('Regex Operators', () => {
  describe('match Operator', () => {
    test('Should pass given a valid email', () => {
      expect(
        RegexOperators.match(
          'john.doe@autocloud.dev',
          /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/
        )
      ).toBeTruthy()
    })
    test('Should fail given an invalid email', () => {
      expect(
        RegexOperators.match('john.doe', /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/)
      ).toBeFalsy()
    })
  })

  describe('mismatch Operator', () => {
    test('Should pass given an invalid email', () => {
      expect(
        RegexOperators.mismatch('john.doe', /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/)
      ).toBeTruthy()
    })

    test('Should fail given a valid email', () => {
      expect(
        RegexOperators.mismatch(
          'john.doe@autocloud.dev',
          /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/
        )
      ).toBeFalsy()
    })
  })
})
