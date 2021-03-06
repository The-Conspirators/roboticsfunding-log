const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const assert = require('assert')

const bodyParser = require('body-parser')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express()
const port = 8081

app.set('trust proxy', 1)
app.use(session({name: 'sessionID', secret: "secretsecretsecret", cookie: {maxAge: 30000}, resave: false, saveUninitialized: false}))

app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({optionsSuccessStatus: 200}))

const basepath = '/roboticslog/'
app.use(express.json())
var router = express.Router()
app.use(basepath, router)

const dbname = 'roboticsfunding-log'
const dburl = 'mongodb://webapp:roboticsrulez@localhost:27017/'+dbname

const client = new MongoClient(dburl, { useNewUrlParser: true })
let db

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

router.get('/admin.js', (req, res) => {
  if(req.session.granted) res.sendFile(__dirname + '/admin.js')
  else res.sendStatus(401)
})

app.use(basepath, express.static(__dirname))

router.post('/verify', (req, res) => {
  if(!req.session.granted){
    res.sendStatus(401)
    return
  }
  console.log(req.body)
  db.collection('sells').updateOne({_id: new mongo.ObjectID(req.body._id)}, {$set: {verified: req.body.verified}}, (err, result) => {
    assert.equal(null, err)

    if(req.body.verified) console.log('verified ' + JSON.stringify(req.body._id))
    else console.log('un-verified ' + JSON.stringify(req.body._id))
  })
  res.status(200).send(req.body.verified)
})

router.post('/add', (req, res) => {
  //res.send(JSON.stringify(req.body))
  addSell(req.body.date/*new Date().toISOString()*/, req.body.name, req.body.type, req.body.amount)
  //res.send({"ok": "1"})
  res.redirect(basepath)
})

router.get('/list', (req, res) => {
  let callback = res.send.bind(res)
  db.collection('sells').find({}).toArray(function(err, docs) {
    assert.equal(err, null)
    console.log("Found records on request.")
    callback(docs)
  })
})

router.get('/secretlogin', (req,res) => {
  req.session.granted = true
  res.redirect(basepath)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

