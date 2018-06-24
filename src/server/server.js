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
