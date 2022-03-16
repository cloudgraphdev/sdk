import ComparisonOperators from '../../src/rules-engine/operators/comparison'

describe('Comparison Operators', () => {
  describe('Equal Operator', () => {
    test('Should pass given two equal strings', () => {
      const result = ComparisonOperators.equal('Switch', 'Switch')
      expect(result).toBeTruthy()
    })

    test('Should fail given two different strings', () => {
      const result = ComparisonOperators.equal('PS5', 'Xbox Series X')
      expect(result).toBeFalsy()
    })
    test('Should pass given two different numbers', () => {
      const result = ComparisonOperators.equal(360, 360)
      expect(result).toBeTruthy()
    })
    test('Should fail given two different numbers', () => {
      const result = ComparisonOperators.equal(360, 90)
      expect(result).toBeFalsy()
    })
    test('Should pass given two equal values with different types', () => {
      const result = ComparisonOperators.equal(180, '180')
      expect(result).toBeTruthy()
    })
  })

  describe('NotEqual Operator', () => {
    test('Should fail given two equal strings', () => {
      const result = ComparisonOperators.notEqual('Switch', 'Switch')
      expect(result).toBeFalsy()
    })

    test('Should pass given two different strings', () => {
      const result = ComparisonOperators.notEqual('PS5', 'Xbox Series X')
      expect(result).toBeTruthy()
    })
    test('Should fail given two different numbers', () => {
      const result = ComparisonOperators.notEqual(360, 360)
      expect(result).toBeFalsy()
    })
    test('Should pass given two different numbers', () => {
      const result = ComparisonOperators.notEqual(360, 90)
      expect(result).toBeTruthy()
    })
    test('Should pass given two equal values with different types', () => {
      const result = ComparisonOperators.notEqual(180, '180')
      expect(result).toBeTruthy()
    })
  })

  describe('LessThan and LessThanInclusive Operator', () => {
    test('Should fail if the first string is less than the second one', () => {
      const result = ComparisonOperators.lessThan('X', 'A')
      expect(result).toBeFalsy()
    })

    test('Should fail comparing the same string', () => {
      const result = ComparisonOperators.lessThan('A', 'A')
      expect(result).toBeFalsy()
    })

    test('Should pass if the first string is greater than the second one', () => {
      const result = ComparisonOperators.lessThan('A', 'X')
      expect(result).toBeTruthy()
    })

    test('Should pass if the first number is less than the second one', () => {
      const result = ComparisonOperators.lessThan(10, 100)
      expect(result).toBeTruthy()
    })

    test('Should fail comparing the same number', () => {
      const result = ComparisonOperators.lessThan(10, 10)
      expect(result).toBeFalsy()
    })

    test('Should fail if the first number is greater than the second one', () => {
      const result = ComparisonOperators.lessThan(100, 10)
      expect(result).toBeFalsy()
    })

    test('Should pass if the first number is less or equal than the second one', () => {
      expect(ComparisonOperators.lessThanInclusive(1, 10)).toBeTruthy()
      expect(ComparisonOperators.lessThanInclusive(10, 10)).toBeTruthy()
    })

    test('Should pass if the first string is less or equal than the second one', () => {
      expect(ComparisonOperators.lessThanInclusive('a', 'x')).toBeTruthy()
      expect(ComparisonOperators.lessThanInclusive('a', 'a')).toBeTruthy()
    })

    test('Should pass if the first date is before than the second one', () => {
      const result = ComparisonOperators.lessThan(
        '2022-03-15T20:42:58.510Z',
        new Date().toISOString()
      )
      expect(result).toBeTruthy()
    })
    test('Should fail if the first date is after than the second one', () => {
      const result = ComparisonOperators.lessThan(
        new Date().toISOString(),
        '2022-03-15T20:42:58.510Z'
      )
      expect(result).toBeFalsy()
    })
  })

  describe('GreaterThan and GreaterThanInclusive Operator', () => {
    test('Should fail if the first string is greater than the second one', () => {
      const result = ComparisonOperators.greaterThan('A', 'X')
      expect(result).toBeFalsy()
    })

    test('Should fail comparing the same string', () => {
      const result = ComparisonOperators.greaterThan('A', 'A')
      expect(result).toBeFalsy()
    })

    test('Should pass if the first string is less than the second one', () => {
      const result = ComparisonOperators.greaterThan('X', 'A')
      expect(result).toBeTruthy()
    })

    test('Should pass if the first number is greater than the second one', () => {
      const result = ComparisonOperators.greaterThan(100, 10)
      expect(result).toBeTruthy()
    })

    test('Should fail comparing the same number', () => {
      const result = ComparisonOperators.greaterThan(10, 10)
      expect(result).toBeFalsy()
    })

    test('Should fail if the first number is less than the second one', () => {
      const result = ComparisonOperators.greaterThan(10, 100)
      expect(result).toBeFalsy()
    })

    test('Should pass if the first number is greater or equal than the second one', () => {
      expect(ComparisonOperators.greaterThanInclusive(10, 1)).toBeTruthy()
      expect(ComparisonOperators.greaterThanInclusive(10, 10)).toBeTruthy()
    })

    test('Should pass if the first string is greater or equal than the second one', () => {
      expect(ComparisonOperators.greaterThanInclusive('x', 'a')).toBeTruthy()
      expect(ComparisonOperators.greaterThanInclusive('a', 'a')).toBeTruthy()
    })

    test('Should pass if the first date is after than the second one', () => {
      const result = ComparisonOperators.greaterThan(
        new Date().toISOString(),
        '2022-03-15T20:42:58.510Z'
      )
      expect(result).toBeTruthy()
    })
    test('Should fail if the first date is before than the second one', () => {
      const result = ComparisonOperators.greaterThan(
        '2022-03-15T20:42:58.510Z',
        new Date().toISOString()
      )
      expect(result).toBeFalsy()
    })
  })
})
