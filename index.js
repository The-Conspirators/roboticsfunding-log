const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000

const dburl = 'mongodb://localhost:27017'
app.use(express.static('.'))
app.use(bodyParser.urlencoded({extended: true}))
//app.use(express.json())

const dbname = 'roboticsfunding-log'

const client = new MongoClient(dburl)
let db;

client.connect(function(err) {
  assert.equal(null, err)
  console.log('Connected successfully to server')

  db = client.db(dbname)
})

function addSell(date, seller, type, amount){
  let sell = {date: date, seller: seller, type: type, amount: amount}
  db.collection('sells').insertOne(sell, (err, result) => {
    assert.equal(null, err)

    console.log('inserted ' + JSON.stringify(sell))
  })
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/add/', (req, res) => {
  addSell(req.body)
  res.send({"ok": "1"})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

