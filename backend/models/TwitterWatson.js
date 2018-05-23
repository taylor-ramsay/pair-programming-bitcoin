const mongoose = require('mongoose');
      Schema = mongoose.Schema

const twitterSentimentSchema = new Schema({
    label: String,
    score: Number,
    text: {
        type: String,
        unique: true,
        required: true
    },
    date: Date,
    count: Number,
    location: {
        type: String
    }
})

const TwitterSentimentModel = mongoose.model('TwitterWatson', twitterSentimentSchema)

module.exports = TwitterSentimentModel;

//LOOP TROUGH A DATE FILTER TO GET 100 RESULTS FOR EVERY LAST 7 DAYS