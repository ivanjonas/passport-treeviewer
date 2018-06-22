var test = require('tape')
var numGen = require('../src/client/scripts/lib/number-generator')

test('number generator', function (t) {
  var arr1 = numGen.generateNodes(15, 1, 100)
  var outsideBounds = arr1.some(element => {element < 1 || element > 100})
  t.notOk(outsideBounds, "numbers should not be generated outside of requested bounds")

  var arr2 = numGen.generateNodes(1, 3, 3)
  t.ok(arr2[0] === 3, "maximum number can be generated")

  try {
    numGen.generateNodes()
  } catch (e) {
    t.pass("node count is required")
  }

  try {
    numGen.generateNodes(16)
    t.fail("should not generate more than 15 nodes")
  } catch (e) {
    t.pass("node count <= 15")
  }

  try {
    console.log(numGen.generateNodes(0))
    t.fail("should not accept 0 nodes")
  } catch (e) {
    t.pass("node count != 0")
  }

  try {
    numGen.generateNodes(-1)
    t.fail("should not accept negative nodes")
  } catch (e) {
    t.pass("node count > 0")
  }

  try {
    numGen.generateNodes(15, -1)
    t.fail("should not accept a negative minimum")
  } catch (e) {
    t.pass("min >= 0")
  }

  try {
    numGen.generateNodes(15, 1, -1)
    t.fail("should not accept a negative maximum")
  } catch (e) {
    t.pass("max >= 0")
  }

  try {
    numGen.generateNodes(15, 3, 2)
    t.fail("should not accept a minimum that's greater than the maximum")
  } catch (e) {
    t.pass("min < max")
  }

  t.end()
});