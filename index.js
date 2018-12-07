const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const express = require('express')
const app = express()
const port = 8080
app.use(express.json)

const dburl = 'mongodb://localhost:27017'
const dbname = 'roboticsfunding-log'

const client = new MongoClient(dburl)
let db;

client.connect(function(err) {
  assert.equal(null, err)
  console.log('Connected successfully to server')

  db = client.db(dbname)
})

function addSell(sell){
  sell.date = new Date().toDateString()
  db.sells.insert(sell)
}


app.get('/', (req, res) => res.send('Hello World!'))
app.post('/add/', (req, res) => {
  addSell(req.body)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

