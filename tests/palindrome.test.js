const { palindrome, average } = require('../utils/palindrome_testing')

describe('average', () => {
  test('El promedio de un elemento es: 1', () => {
    expect(average([1])).toBe(1)
  })
  test('El array esta vacio', () => {
    expect(average([])).toBe(0)
  })
  test('Array undefined', () => {
    expect(average()).toBeUndefined()
  })
})

describe('Palindrome Test', () => {
  test('palindrome of susan', () => {
    const result = palindrome('susan')
    expect(result).toBe('nasus')
  })

  test('palindrome of empty string', () => {
    const result = palindrome('')
    expect(result).toBe('')
  })

  test('palindrome of undefined', () => {
    const result = palindrome()
    expect(result).toBeUndefined()
  })
})
