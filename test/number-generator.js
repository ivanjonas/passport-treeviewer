import test from 'tape'
import generateNodes from '../src/server/lib/number-generator'

test('number-generator', t => {
  const arr1 = generateNodes(15, 1, 100)
  const outsideBounds = arr1.some(element => { element < 1 || element > 100 })
  t.notOk(outsideBounds, "numbers should not be generated outside of requested bounds")

  const arr2 = generateNodes(1, 3, 3)
  t.ok(arr2[0] === 3, "maximum number can be generated")

  t.throws(() => generateNodes(), "node count is required")

  t.throws(() => generateNodes(16), "should not generate more than 15 nodes")

  t.throws(() => generateNodes(0), "should not accept 0 nodes")

  t.throws(() => generateNodes(-1), "should not accept negative nodes")

  t.throws(() => generateNodes(15, -1), "should not accept a negative minimum")

  t.throws(() => generateNodes(15, 1, -1), "should not accept a negative maximum")

  t.throws(() => generateNodes(15, 3, 2), "should not accept a minimum that's greater than the maximum")

  t.end()
});