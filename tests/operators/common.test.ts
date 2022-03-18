import CommonOperators from '../../src/rules-engine/operators/common'

describe('Common Operators', () => {
  describe('isEmpty Operator', () => {
    test('Should pass given an empty array', () => {
      expect(CommonOperators.isEmpty([], true)).toBeTruthy()
    })
    test('Should fail given an empty array', () => {
      expect(CommonOperators.isEmpty([], false)).toBeFalsy()
    })
    test('Should pass given a filled array', () => {
      expect(CommonOperators.isEmpty(['filled'], true)).toBeFalsy()
    })
    test('Should fail given a filled array', () => {
      expect(CommonOperators.isEmpty(['filled'], false)).toBeTruthy()
    })
    test('Should pass given a filled object', () => {
      expect(CommonOperators.isEmpty({ key: 'one' }, false)).toBeTruthy()
    })
    test('Should fail given a empty object', () => {
      expect(CommonOperators.isEmpty({}, false)).toBeFalsy()
    })
    test('Should pass given a empty object', () => {
      expect(CommonOperators.isEmpty({}, true)).toBeTruthy()
    })
    test('Should fail given a filled object', () => {
      expect(CommonOperators.isEmpty({ key: 'one' }, true)).toBeFalsy()
    })
    test('Should fail given a null value', () => {
      expect(CommonOperators.isEmpty(null, true)).toBeFalsy()
    })
    test('Should fail given an undefined value', () => {
      expect(CommonOperators.isEmpty(undefined, true)).toBeFalsy()
    })
    test('Should fail given an integer', () => {
      expect(CommonOperators.isEmpty(33, true)).toBeFalsy()
    })
    test('Should fail given a string', () => {
      expect(CommonOperators.isEmpty('string', true)).toBeFalsy()
    })
    test('Should fail given a boolean', () => {
      expect(CommonOperators.isEmpty(true, true)).toBeFalsy()
    })
  })
})
