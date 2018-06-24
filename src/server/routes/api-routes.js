import { transformMysqlData } from '../lib/data-transform'

module.exports = (app, connection) => {
  app.get('/api/getTree', (req, res) => {
    connection.query({
      sql: 'select factory_node.id, factory_node.node_name, factory_node.min, factory_node.max, child_node.node_value from factory_node join child_node on factory_node.id = child_node.factory',
      nestTables: true
    }, (error, results) => {
      if (error) throw error
      res.send(transformMysqlData(results))
    })
  })

  app.post('/api/createFactory', (req, res) => {
    // TODO validate req.body for required fields, etc
    var newFactory = {
      factoryName: req.body.name,
      min: req.body.min,
      max: req.body.max,
      nodes: []
    }

    res.json({
      success: true,
      newFactory
    })
  })
}
