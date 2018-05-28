const mongoose = require('mongoose');
      Schema = mongoose.Schema

const bitcoinPriceSchema = new Schema({
    date: {
        type: Date,
        unique: true
    },
    price: Number,
})

const bitcoinPriceModel = mongoose.model('BitcoinPrice', bitcoinPriceSchema)

module.exports = bitcoinPriceModel;