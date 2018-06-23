var express = require("express")
var path = require("path")
var bodyParser = require('body-parser')

var PORT = process.env.PORT || 3000
var app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended : true}))
app.use(bodyParser.json())

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.post("/createFactory", function(req, res) {
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

app.listen(PORT, function() {
  console.log("Listening on port: " + PORT)
})
