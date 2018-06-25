import { transformMysqlData } from '../lib/data-transform'
import { factoryNodeFactory } from '../models/factoryNode'
import database from '../database'
import socketio from 'socket.io'

const connection = database.connect()
const messages = {
  invalidData: 'form did not have valid data'
}

function sendTree(path, receiver) {
  connection.query({
    sql: 'select factory_node.id, factory_node.node_name, factory_node.min, factory_node.max, child_node.node_value from factory_node left join child_node on factory_node.id = child_node.factory',
    nestTables: true
  }, (error, results) => {
    if (error) throw error
    console.log('sending a tree to someone')
    receiver.emit(path, transformMysqlData(results))
  })
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected')
    sendTree('/api/getTree', socket)

    socket.on('/api/createFactory', (data, fn) => {
      const newFactory = factoryNodeFactory.create(data.name, data.min, data.max)
  
      if (!newFactory) {
        fn({
          success: false,
          message: messages.invalidData
        })
        return
      }
  
      // now that we have a valid new node, save it to the database and send
      // the updated tree to the client
      database.insertFactoryNode(newFactory)
        .then((insertId) => {
          fn({
            success: true
          })
          sendTree('/api/getTree', io)
        })
        .catch((error) => {
          fn({
            success: false,
            message: messages.invalidData
          })
        })
    })

    socket.on('/api/getTree', () => {
      console.log('a user requested the tree')
      sendTree('/api/getTree', socket)
    })
  })


  
}
