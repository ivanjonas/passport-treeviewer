function randNumberBetween(min, max) {
  /// min inclusive, max exclusive
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function generateNodes(count, min, max) {
  var i
  var results

  if (count == undefined) {
    throw "count cannot be null or undefined"
  }

  min = min || 0
  max = max || 255

  if (count < 1 || count > 15) {
    throw "count must be between 1 and 15"
  }
  if (min < 0) {
    throw "min must be non-negative"
  }
  if (max < 0) {
    throw "max must be non-negative"
  }
  if (min > max) {
    throw "min must not be greater than max"
  }

  results = []
  for (i = 0; i < count; i++) {
    results.push(randNumberBetween(min, max))
  }

  return results
}
