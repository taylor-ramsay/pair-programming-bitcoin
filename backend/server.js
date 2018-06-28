const express = require('express');
const apis = require('./twitterApi.js');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080
const dev = app.get('env') !== 'production'

setInterval(function () {
apis.runApis()
}, 86400000);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

const db = mongoose.connection;

db.on('open', () => {
    console.log('connected to mongodb');
});

const TwitterWatson = require('./models/TwitterWatson')
const BitcoinPrice = require('./models/BitcoinPrice')

app.get('/data', (req, res) => {
    TwitterWatson.find({}).sort('-date')
        .then(result => {
            res.json(result);
        })
        .catch(error => {
            console.log(error);
        })
})

app.get('/bitcoin-price', (req, res) => {
    BitcoinPrice.find({}).sort('-date')
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            console.log(error);
        })
})

if (!dev) {
    console.log('Production')
    app.disable('x-powered-by')
    app.use(express.static(__dirname + '/frontend/build'));
    app.get('*', (req, res) => res.sendFile(__dirname + '/frontend/build/index.html'));
    mongoose.connect('mongodb://localhost/TwitterWatsonDB')
}

if (dev) {
    console.log('Development')
    app.use(express.static(__dirname + '/frontend/public'));
    mongoose.connect('mongodb://localhost/TwitterWatsonDB')
    //CORS
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
        next();
    });
}

//Port 8080
app.listen(PORT, () => {
    console.log("server listening on port", PORT);
});