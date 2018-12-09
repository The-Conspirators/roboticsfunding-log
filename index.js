const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 3000

app.use(express.static('.'))
app.use(bodyParser.urlencoded({extended: true}))
//app.use(express.json())

const dbname = 'roboticsfunding-log'
const dburl = 'mongodb://webapp:roboticsrulez@localhost:27017/'+dbname

const client = new MongoClient(dburl, { useNewUrlParser: true })
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
  //res.send(JSON.stringify(req.body));
  addSell(req.body.date/*new Date().toISOString()*/, req.body.name, req.body.type, req.body.amount)
  //res.send({"ok": "1"})
  res.redirect('/')
})

app.get('/list/', (req, res) => {
  let callback = res.send.bind(res);
  db.collection('sells').find({}).toArray(function(err, docs) {
    assert.equal(err, null)
    console.log("Found records on request.")
    callback(docs)
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

