import { transformMysqlData } from '../lib/data-transform'
import { factoryNodeFactory, generateChildNodes } from '../models/factoryNode'
import database from '../database'
import socketio from 'socket.io'

let cachedTree
const connection = database.connect()
const messages = {
  invalidArguments: 'form did not have valid data',
  factoryNotFound: 'a factory node with that ID was not found',
  genericDatabaseError: 'there was a problem with the database'
}
function messageObject(success, message) {
  return { success, message }
}

function sendTree(receiver) {
  connection.query({
    sql: 'select factory_node.id, factory_node.node_name, factory_node.min, factory_node.max, child_node.node_value from factory_node left join child_node on factory_node.id = child_node.factory ORDER BY factory_node.id',
    nestTables: true
  }, (error, results) => {
    if (error) throw error

    cachedTree = transformMysqlData(results)
    receiver.emit('/api/getTree', cachedTree)
  })
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('a user connected')
    sendTree(socket)

    socket.on('/api/getTree', () => {
      console.log('a user requested the tree')
      sendTree(socket)
    })

    socket.on('/api/createFactory', (data, fn) => {
      try {
        data.min = parseInt(data.min, 10)
        data.max = parseInt(data.max, 10)
      } catch (error) {
        fn(messageObject(false, messages.invalidArguments))
        return
      }
      const newFactory = factoryNodeFactory.create(data.name, data.min, data.max)

      if (!newFactory) {
        fn(messageObject(false, messages.invalidArguments))
        return
      }

      // now that we have a valid new node, save it to the database and send
      // the updated tree to the client
      database.insertFactoryNode(newFactory)
        .then((insertId) => {
          fn({ success: true })
          sendTree(io)
        })
        .catch((error) => {
          console.log(error)
          fn(messageObject(false, messages.invalidArguments))
        })
    })

    socket.on('/api/generateNodes', (generateNodeRequest, fn) => {
      const count = generateNodeRequest.count
      const factory = generateChildNodes(cachedTree.find(
        (factory) => factory.id = generateNodeRequest.factoryId
      ), generateNodeRequest.count)

      if (!factory) {
        fn(messageObject(false, messages.invalidArguments))
        return
      }

      database.updateChildNodes(factory)
        .then(() => {
          fn({ success: true })
          sendTree(io)
        })
        .catch((error) => {
          console.log(error)
          fn(messageObject(false, messages.genericDatabaseError))
        })
    })
  })
}
