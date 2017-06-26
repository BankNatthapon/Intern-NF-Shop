const express = require('express')
const MongoClient = require('mongodb').MongoClient
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json())


app.use(cors())

const url = 'mongodb://localhost:27017/intern-shop';

// app.use((req, res ,next) => {
//   res.header('Access-Control-Allow-Origin', "*")
//   res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE")
//   res.header('Access-Control-Allow-Headers', "Content-Type")
// })

app.use(express.static(path.resolve(__dirname,'../intern-shop/public')))
app.get('/',(req,res)=>{
  res.sendFile(path.resolve(__dirname,'../public/index.html'))
})

let i = 0
app.get('/api/getProduct', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if(!err){
        var collection = db.collection('products')
        collection.find({}).toArray((err, productStore) => {
        console.log(productStore)
        console.log("SelectData Complete...")
        console.log(i++);
          // for (var i = 0; i < productStore.length; i++) {
          //   productName.push(productStore[i].name)
          // }

        res.send(productStore)
        })
    }
    else console.log(err)
    db.close()
  })
})

app.get('/api/deleteAll', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if(!err){
        var collection = db.collection('products')
        collection.deleteMany({})
      console.log("Delete Complete...")
      res.send("Delete Complete...")
    }
    else console.log(err)
    db.close()
  })
})

app.post('/api/insertProduct', function (req, res) {
  MongoClient.connect(url, function(err, db) {
    if(!err){
      db.collection('products').insert(req.body)
      console.log("Insert Complete...")
        res.send({success:true})
    }
    else {
      db.close()
      res.send({success:false,message:err.message})
    }
  })
})

app.listen(PORT,()=>console.log(`listening on ${PORT} ...`))
