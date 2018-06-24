import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import mySQL from 'mysql'
import { transformMysqlData } from './lib/data-transform'

const connectionConfig = process.env.JAWSDB_URL || {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'passport_treeviewer'
}
const connection = mySQL.createConnection(connectionConfig)
connection.connect(function (err) {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
});

const port = process.env.PORT || 3000
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./routes/web-routes')(app)
require('./routes/api-routes')(app, connection)

app.listen(port, () => {
  console.log('Listening on port: ' + port)
})
