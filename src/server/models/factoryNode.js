import generateRandomNumbers from '../lib/number-generator'

// following the factory pattern rather than using JS class
// which results in a funny name
const factoryNodeFactory = {
  create: function (name, min, max, nodes) {
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
      nodes: (nodes == null ? [] : nodes)
    }
  }
}

const generateChildNodes = (oldFactoryNode, count) => {
  if (oldFactoryNode == null
    || typeof count !== 'number'
    || count < 0
    || count > 15) {
    return
  }

  try {
    const newChildNodes = generateRandomNumbers(count, oldFactoryNode.min, oldFactoryNode.max)
    const newFactoryNode = factoryNodeFactory.create(
      oldFactoryNode.factoryName,
      oldFactoryNode.min,
      oldFactoryNode.max,
      newChildNodes)

    // TODO overload factoryNodeFactory.create to take a factoryNode object
    if (oldFactoryNode.id) {
      newFactoryNode.id = oldFactoryNode.id
    }

    return newFactoryNode
  } catch (error) {
    return
  }
}

export { factoryNodeFactory, generateChildNodes }
