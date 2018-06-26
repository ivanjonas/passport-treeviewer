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

const queries = {
  insertFactoryNode: 'INSERT INTO factory_node (node_name, min, max) VALUES (?, ?, ?)',
  bulkInsertChildNode: 'INSERT INTO child_node (factory, node_value) VALUES ?',
  deleteChildNodes: 'DELETE FROM child_node WHERE factory = ?',
  deleteFactoryNode: 'DELETE FROM factory_node WHERE id = ?',
  updateFactoryNodeName: 'UPDATE factory_node SET node_name = ? WHERE id = ?',
  updateFactoryBounds: 'UPDATE factory_node SET min = ?, max = ? WHERE id = ?'
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
  },

  insertFactoryNode: (factoryNode) => {
    return new Promise((resolve, reject) => {
      const query = mysql.format(queries.insertFactoryNode,
        [
          factoryNode.factoryName, // all prepared statement replacements with a single ? are automatically cleaned for injection attacks
          factoryNode.min,
          factoryNode.max
        ])
      cachedConnection.query(query, (error, results) => {
        error ? reject('database rejected insert') : resolve(results.insertId)
      })
    })
  },

  updateChildNodes: (factoryNode) => {
    return new Promise((resolve, reject) => {
      // delete existing child nodes and create new ones
      // two queries, so use a transaction in case a rollback is needed

      cachedConnection.beginTransaction((error) => {
        if (error) {
          console.log(error)
          reject('database transaction error')
          return
        }

        cachedConnection.query(queries.deleteChildNodes, factoryNode.id, (error) => {
          if (error) {
            console.log(error)
            cachedConnection.rollback(() => {
              reject('database rejected deletion of existing child nodes')
              return
            })
          }

          if (factoryNode.nodes.length === 0) {
            // the deletion was all that was necessary
            cachedConnection.commit((error) => {
              if (error) {
                console.log(error)
                cachedConnection.rollback(() => {
                  reject('database rejected insert')
                });
              }
              resolve()
            });
          }

          const newValues = factoryNode.nodes.map((nodeValue) => {
            return [factoryNode.id, nodeValue]
          })

          cachedConnection.query(queries.bulkInsertChildNode, [newValues], (error, results) => {
            if (error) {
              console.log(error)
              cachedConnection.rollback(() => {
                reject('database rejected insert')
                return
              })
            } else {
              cachedConnection.commit((error) => {
                if (error) {
                  console.log(error)
                  cachedConnection.rollback(() => {
                    reject('database rejected insert')
                  });
                }
                resolve()
              });
            }
          })
        })
      })
    })
  },

  deleteFactoryNode: (factoryNodeId) => {
    return new Promise((resolve, reject) => {
      cachedConnection.query(queries.deleteFactoryNode, factoryNodeId, (error) => {
        if (error) {
          console.log(error)
          reject('database rejected deletion')
          return
        }

        resolve()
      })
    })
  },

  renameFactoryNode: (factoryNodeId, newName) => {
    return new Promise((resolve, reject) => {
      cachedConnection.query(queries.updateFactoryNodeName, [newName, factoryNodeId], (error) => {
        if (error) {
          console.log(error)
          reject('database rejected rename/update')
          return
        }
        resolve()
      })
    })
  },

  changeBounds: (factoryNode) => {
    return new Promise((resolve, reject) => {
      cachedConnection.query(
        queries.updateFactoryBounds,
        [factoryNode.min, factoryNode.max, factoryNode.id],
        (error) => {
          if (error) {
            console.log(error)
            reject('database rejected update of factory_node boundaries')
            return
          }
          resolve()
        })
    })
  }
}
