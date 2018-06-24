import path from 'path'

module.exports = (app) => {
  app.get('/', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'))
  })
}
