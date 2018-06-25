import test from 'tape'
import generateRandomNumberArray from '../src/server/lib/number-generator'

test('number-generator', t => {
  const arr1 = generateRandomNumberArray(15, 1, 100)
  const outsideBounds = arr1.some(element => { element < 1 || element > 100 })
  t.notOk(outsideBounds, "numbers should not be generated outside of requested bounds")

  const arr2 = generateRandomNumberArray(1, 3, 3)
  t.ok(arr2[0] === 3, "maximum number can be generated")

  t.throws(() => generateRandomNumberArray(), "count is required")

  let arr3
  t.doesNotThrow(() => {
    arr3 = generateRandomNumberArray(255)
  }, "can generate more than 15 elements")

  t.equal(255, arr3.length, "default parameters work")

  t.doesNotThrow(() => generateRandomNumberArray(0, 1, 100), "should accept a count of 0")

  t.throws(() => generateRandomNumberArray(-1, 1, 100), "should not accept negative counts")

  t.doesNotThrow(() => generateRandomNumberArray(15, 0, 100), "should accept 0 as minimum count value")

  t.throws(() => generateRandomNumberArray(15, -1, 100), "should not accept a negative minimum")

  t.throws(() => generateRandomNumberArray(15, 1, -1), "should not accept a negative maximum")

  t.throws(() => generateRandomNumberArray(15, 3, 2), "should not accept a minimum that's greater than the maximum")

  t.end()
});