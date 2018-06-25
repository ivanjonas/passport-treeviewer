import { transformMysqlData } from '../lib/data-transform'
import { factoryNodeFactory } from '../models/factoryNode'
import database from '../database'

const connection = database.connect()
const messages = {
  invalidData: 'form did not have valid data'
}

module.exports = (app) => {
  app.get('/api/getTree', (req, res) => {
    connection.query({
      sql: 'select factory_node.id, factory_node.node_name, factory_node.min, factory_node.max, child_node.node_value from factory_node left join child_node on factory_node.id = child_node.factory',
      nestTables: true
    }, (error, results) => {
      if (error) throw error
      res.send(transformMysqlData(results))
    })
  })

  app.post('/api/createFactory', (req, res) => {
    const newFactory = factoryNodeFactory.create(req.body.name, req.body.min, req.body.max)

    if (!newFactory) {
      res.json({
        success: false,
        message: messages.invalidData
      })
      return
    }

    // now that we have a valid new node, save it to the database and send
    // the updated tree to the client
    database.insertFactoryNode(newFactory)
      .then((insertId) => {
        res.json({
          success: true,
          newFactory
        })
      })
      .catch((error) => {
        res.json({
          success: false,
          message: messages.invalidData
        })
      })
  })
}
