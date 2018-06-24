import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended : true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
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

app.listen(PORT, () => {
  console.log('Listening on port: ' + PORT)
})
