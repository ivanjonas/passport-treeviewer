import express from 'express'
import bodyParser from 'body-parser'
import database from './database.js'

const connection = database.connect()

const port = process.env.PORT || 3000
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./routes/web-routes')(app)
require('./routes/api-routes')(app)

app.listen(port, () => {
  console.log('Listening on port: ' + port)
})
