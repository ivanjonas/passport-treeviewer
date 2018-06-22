var express = require("express")
var path = require("path")
var PORT = process.env.PORT || 3000
var app = express()

app.use(express.static("public"))

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(PORT, function() {
  console.log("Listening on port: " + PORT)
})
