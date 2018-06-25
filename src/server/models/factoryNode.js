// following the factory pattern rather than using JS class
// which results in a funny name

const factoryNodeFactory = {
  create: function (name, min, max) {
    try {
      min = parseInt(min, 10)
      max = parseInt(max, 10)
    } catch (error) {
      return
    }

    if ((typeof name) !== 'string'
      || name.trim().length === 0
      || (typeof min !== 'number')
      || (typeof max !== 'number')
      || min > max) {
      // factoryNode parameters do not match requirements
      return
    }

    // Will not have an ID until the node is saved to the database.
    return {
      factoryName: name.trim(),
      min,
      max,
      nodes: []
    }
  }
}

export { factoryNodeFactory }
