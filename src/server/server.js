import express from 'express'
import database from './database.js'

database.connect()

const port = process.env.PORT || 3000
const app = express()
const httpServer = require('http').Server(app)
const io = require('socket.io')(httpServer)

app.use(express.static('public'))

require('./routes/web-routes')(app)
require('./routes/api-routes')(io)

httpServer.listen(port, () => {
  console.log('Listening on port: ' + port)
})
