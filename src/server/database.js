import appRoot from 'app-root-path'
import path from 'path'
import mysql from 'mysql'
import { readFileSync } from 'fs'

let cachedConnection
const connectionConfig = process.env.JAWSDB_URL || {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'passport_treeviewer'
}

module.exports = {
  connect: () => {
    if (cachedConnection) {
      return cachedConnection
    } 

    const connection = mysql.createConnection(connectionConfig)
    connection.connect((err) => {
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

    // the connection may not be complete at this point, but no waiting is necessary.
    cachedConnection = connection
    return cachedConnection
  }
}
