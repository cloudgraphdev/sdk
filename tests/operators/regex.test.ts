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

  describe('matchAny Operator', () => {
    test('Should fail given an invalid array', () => {
      expect(
        RegexOperators.matchAny('john.doe', /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/)
      ).toBeFalsy()
    })

    test('Should fail given an array with invalid emails', () => {
      expect(
        RegexOperators.matchAny(['john.doe'], /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/)
      ).toBeFalsy()
    })

    test('Should pass given at least one valid email', () => {
      expect(
        RegexOperators.matchAny(
          ['john.doe', 'matt.dAvella@autocloud.dev'],
          /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/
        )
      ).toBeTruthy()
    })
  })

  describe('matchAll Operator', () => {
    test('Should fail given an invalid array', () => {
      expect(
        RegexOperators.matchAll('john.doe', /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/)
      ).toBeFalsy()
    })

    test('Should fail given an array with invalid emails', () => {
      expect(
        RegexOperators.matchAll(['john.doe'], /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/)
      ).toBeFalsy()
    })

    test('Should fail given an array of valid emails', () => {
      expect(
        RegexOperators.matchAll(
          ['john.doe@autocloud.dev', 'matt.dAvella@autocloud.dev'],
          /[\w\d.-]+@[\w\d.-]+\.[\w\d.-]+/
        )
      ).toBeTruthy()
    })
  })
})
