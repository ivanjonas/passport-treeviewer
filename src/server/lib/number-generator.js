function randNumberBetween(min, max) {
  /// min inclusive, max exclusive
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function generateRandomNumberArray(count, min = 0, max = 256) {
  var i
  var results

  if (count == undefined) {
    throw "count cannot be null or undefined"
  }

  if (count < 0 || min < 0 || max < 0) {
    throw "count, min, and max must be non-negative"
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
