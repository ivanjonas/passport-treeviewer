import { factoryNodeFactory, generateChildNodes, changeBounds } from '../models/factoryNode'
import escape from 'escape-html'
import database from '../database'

let cachedTree
const messages = {
  invalidArguments: 'form did not have valid data',
  factoryNotFound: 'a factory node with that ID was not found',
  genericDatabaseError: 'there was a problem with the database'
}
function messageObject(success, message) {
  return { success, message }
}

function sendTree(receiver) {
  database.getTree()
  .then((tree) => {
    cachedTree = tree
    receiver.emit('/api/getTree', cachedTree)
  }).catch((error) => {
    console.log(error)
    throw error
  })
}

function findById(factoryId) {
  return cachedTree.find(
    (factory) => factory.id === factoryId
  )
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
      data.name = escape(data.name)
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
      const oldFactory = findById(generateNodeRequest.factoryId)
      const childNodeCount = oldFactory.nodes.length
      const newFactory = generateChildNodes(
        oldFactory,
        generateNodeRequest.count)

        console.log(oldFactory)
        console.log(newFactory)
      if (!newFactory || (oldFactory.nodes.length === 0 && newFactory.nodes.length === 0)) {
        fn(messageObject(false, messages.invalidArguments))
        return
      }

      database.updateChildNodes(oldFactory, newFactory)
        .then(() => {
          fn({ success: true })
          sendTree(io)
        })
        .catch((error) => {
          console.log(error)
          fn(messageObject(false, messages.genericDatabaseError))
        })
    })

    socket.on('/api/deleteFactory', (factoryNodeId, fn) => {
      if (typeof factoryNodeId !== 'number') {
        fn(messageObject(false, messages.invalidArguments))
        return
      }

      const factory = findById(factoryNodeId)
      if (!factory) {
        fn(messageObject(false, messages.invalidArguments))
        return
      }

      database.deleteFactoryNode(factoryNodeId)
        .then(() => {
          fn({ success: true })
          sendTree(io)
        })
        .catch((error) => {
          console.log(error)
          fn(messageObject(false, messages.factoryNotFound))
          sendTree(socket)
        })
    })

    socket.on('/api/renameFactory', (renameFactoryRequest, fn) => {
      const newName = escape(renameFactoryRequest.name.toString().trim())
      const id = renameFactoryRequest.factoryId

      if (newName.length === 0 || typeof id !== 'number') {
        fn(messageObject(false, messages.invalidArguments))
      }

      const factory = findById(id)
      if (!factory) {
        fn(messageObject(false, messages.invalidArguments))
      }

      database.renameFactoryNode(id, newName)
        .then(() => {
          fn({ success: true })
          sendTree(io)
        }).catch((error) => {
          console.log(error)
          fn(messageObject(false, messages.genericDatabaseError))
        })
    })

    socket.on('/api/changeBounds', (requestChangeBounds, fn) => {
      let id
      let min
      let max
      try {
        id = parseInt(requestChangeBounds.factoryId, 10)
        min = parseInt(requestChangeBounds.min, 10)
        max = parseInt(requestChangeBounds.max, 10)
      } catch (error) {
        fn(messageObject(false, messages.invalidArguments))
        return
      }

      if (isNaN(id) || isNaN(min) || isNaN(max)
        || min < 0 || min > max) {
        fn(messageObject(false, messages.invalidArguments))
        return
      }

      const oldFactory = findById(id)
      if (!oldFactory) {
        fn(messageObject(false, messages.factoryNotFound))
        sendTree(socket)
        return
      }

      const newFactory = changeBounds(oldFactory, min, max)

      database.changeBounds(newFactory)
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
