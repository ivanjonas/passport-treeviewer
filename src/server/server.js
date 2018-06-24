import appRoot from 'app-root-path'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import mysql from 'mysql'
import { readFileSync } from 'fs'

const connectionConfig = process.env.JAWSDB_URL || {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'passport_treeviewer'
}
const connection = mysql.createConnection(connectionConfig)
connection.connect(function (err) {
  if (err) throw err
  console.log('connected as id ' + connection.threadId)

  // check if tables already exist. If not, create them.
  connection.query('SHOW TABLES', (error, result) => {
    if (error) throw error
    if (result.length === 0) {
      // create the tables with seed data
      // We use multi-statements, which are a potential SQL injection risk.
      // For this reason, we create the tables on a separate connection.

      const connectionConfigMultiStatements = (typeof connectionConfig === 'string')
        ? connectionConfig + '&multipleStatements=true'
        : Object.assign({}, connectionConfig, { multipleStatements: true })
      const connectionMultiStatements = mysql.createConnection(connectionConfigMultiStatements)
      const sqlPath = path.normalize(appRoot + '/database/schema_and_seed.sql')
      connectionMultiStatements.query(
        readFileSync(sqlPath, {
          encoding: 'utf8'
        }),
        (error, results) => {
          if (error) throw error
          connectionMultiStatements.destroy()
        }
      )
    }
  })
})

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
