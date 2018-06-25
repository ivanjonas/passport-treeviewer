import express from 'express'
import bodyParser from 'body-parser'
import database from './database.js'

database.connect()

const port = process.env.PORT || 3000
const app = express()
const httpServer = require('http').Server(app)
const io = require('socket.io')(httpServer)

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./routes/web-routes')(app)
require('./routes/api-routes')(io)

httpServer.listen(port, () => {
  console.log('Listening on port: ' + port)
})
