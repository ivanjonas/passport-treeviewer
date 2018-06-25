export function transformMysqlData(mysqlData) {
  /// into a more usable format

  return mysqlData.reduce((accumulator, row) => {
    // A one-step process uses 'filter' to find existing elements in the
    // accumulator, which I wish to avoid. The only solution I can think of
    // is a two step process: first reduce the array to an object where the
    // factory IDs are keys for fast lookups, and second we transform that
    // into the final format. Performance testing should tell whether one 
    // method is better than the other.

    const existingObject = accumulator.find(node => node.id === row.factory_node.id)
    if (existingObject) {
      existingObject.nodes.push(row.child_node.node_value)
    } else {
      const childValue = row.child_node.node_value
      const newObject = {
        id: row.factory_node.id,
        factoryName: row.factory_node.node_name,
        min: row.factory_node.min,
        max: row.factory_node.max,
        nodes: childValue ? [row.child_node.node_value] : []
      }
      accumulator.push(newObject)
    }
    return accumulator
  }, [])
}
