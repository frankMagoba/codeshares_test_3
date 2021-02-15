const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient

const connectionString = "mongodb+srv://icui4cu2:icui4cu2@smartloan.xfuxu.mongodb.net/albums?retryWrites=true&w=majority"

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('albums')
    const albumCollection = db.collection('albums')

    // ========================
    // Middlewares
    // ========================
    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    // ========================
    // Routes
    // ========================
    app.get('/', (req, res) => {
      db.collection('albums').find().toArray()
        .then(albums => {
          res.render('index.ejs', { albums: albums })
        })
        .catch(/* ... */)
    })

    app.post('/albums', (req, res) => {
      albumCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    app.put('/albums', (req, res) => {
      albumCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            album: req.body.album
          }
        },
        {
          upsert: true
        }
      )
        .then(result => res.json('Success'))
        .catch(error => console.error(error))
    })

    app.delete('/albums', (req, res) => {
      albumCollection.deleteOne(
        { name: req.body.name }
      )
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No album to delete')
          }
          res.json('Deleted Darth Vadar\'s album')
        })
        .catch(error => console.error(error))
    })

    // ========================
    // Listen
    // ========================
    const port = 3000
    app.listen(port, function () {
      console.log(`listening on ${port}`)
    })
  })
  .catch(console.error)