import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import mySQL from 'mysql'

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

function transformMysqlData(mysqlData) {
  /// into a more usable format
  return mysqlData.reduce((accumulator, row) => {
    // A one-step process uses 'filter' to find existing elements in the
    // accumulator, which I wish to avoid. The only solution I can think of
    // is a two step process: first reduce the array to an object where the
    // factory IDs are keys for fast lookups, and second we transform that
    // into the final format. Performance testing should tell whether one 
    // method is better than the other.

    const existingObject = accumulator.find(node => node.id === row.factory_node.id)
    if (existingObject) {
      existingObject.nodes.push(row.child_node.node_value)
    } else {
      const newObject = {
        id: row.factory_node.id,
        factoryName: row.factory_node.node_name,
        min: row.factory_node.min,
        max: row.factory_node.max,
        nodes: [row.child_node.node_value]
      }
      accumulator.push(newObject)
    }
    return accumulator
  }, [])
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/api/getTree', (req, res) => {
  connection.query({
    sql: 'select factory_node.id, factory_node.node_name, factory_node.min, factory_node.max, child_node.node_value from factory_node join child_node on factory_node.id = child_node.factory',
    nestTables: true
  }, (error, results) => {
    if (error) throw error
    res.send(transformMysqlData(results))
  })
})

app.post('/api/createFactory', (req, res) => {
  // TODO validate req.body for required fields, etc
  var newFactory = {
    factoryName: req.body.name,
    min: req.body.min,
    max: req.body.max,
    nodes: []
  }

  res.json({
    success: true,
    newFactory
  })
})

app.listen(port, () => {
  console.log('Listening on port: ' + port)
})
