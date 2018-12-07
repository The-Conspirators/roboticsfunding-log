const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const express = require('express')
const app = express()
const port = 8080

const dburl = 'mongodb://localhost:27017'
const dbname = 'roboticsfunding-log'

const client = new MongoClient(dburl)

client.connect(function(err) {
  assert.equal(null, err)
  console.log("Connected successfully to server")

  const db = client.db(dbname)

  client.close()
})


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

