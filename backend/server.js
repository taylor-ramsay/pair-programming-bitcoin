const express = require('express');
const app = express();
const mongoose = require('mongoose')

var bodyParser = require('body-parser');

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));       
// parse application/json
app.use(bodyParser.json());

// call . connect() to connect to mongod server
mongoose.connect('mongodb://localhost/TwitterWatsonDB')
      
const db = mongoose.connection;

db.on('open', () => {
    console.log('connected to mongodb');
});

const TwitterWatson = require('./models/TwitterWatson')
const BitcoinPrice = require('./models/BitcoinPrice')

app.get('/data', (req, res)=>{
    TwitterWatson.find({})
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            console.log(error);
        })
})

app.get('/bitcoin-price', (req, res)=>{
    BitcoinPrice.find({})
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            console.log(error);
        })
})

app.listen(8080, ()=>{
    console.log('server listen at 8080, ctrl+c to exit!')
})