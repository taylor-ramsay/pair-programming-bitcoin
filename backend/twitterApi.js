var Twitter = require('twitter');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const axios = require('axios')
const mongoose = require('mongoose')
const moment = require('moment')

mongoose.connect('mongodb://localhost/TwitterWatsonDB')

const db = mongoose.connection

db.on('open', ()=>{
    console.log('connecter to mongodb TwitterWatson!')
});

const TwitterWatson = require('./models/TwitterWatson')

// Watson API
var nlu = new NaturalLanguageUnderstandingV1({
    username: "9ad2c2d3-015a-4fc9-8c69-f4283e5ed194",
    password: "0W7Xsw8kvfaA",
    version: '2018-04-05',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

//Twitter API
var client = new Twitter({
    consumer_key: 'juyQWGeqBeGVRadSVbHTLtqGv',
    consumer_secret: 'cdXNptv5whKowO7otpJqRjuxuCjSkdwEf3VpOlhubqQracEdXZ',
    access_token_key: '929507592057032706-SXqNSbIdXrxg0S4lQbcza5C19pVxcLF',
    access_token_secret: 'gPCtGKnIspYHa6kCTMTSx5s24m1xLGRklutXRHsvKThFk'
});

//Parameters for twitter API
for (var d=0; d<7 ;d++) {
    let day = moment().subtract(d, 'days')
    let dayF = day.format("YYYY-MM-DD")
    console.log(dayF)
var params = { q: 'bitcoin news', until: dayF};
client.get('search/tweets', params, function (error, tweets, response) {
    if (!error) {
        //console.log(tweets.statuses.length);
        let twitterData = []
        console.log(tweets.statuses.length)
        for (i = 0; i < tweets.statuses.length; i++) {
            let twitterObj = {};
            if (tweets.statuses[i].retweet_count >= 0) {
                let twitterObj = {
                    date: tweets.statuses[i].created_at,
                    text: tweets.statuses[i].text,
                    retweet_count: tweets.statuses[i].retweet_count,
                    user_location: tweets.statuses[i].user.location
                }
                twitterData.push(twitterObj);
            }
        }
    
        for (var j = 0; j < twitterData.length; j++) {
            let tweetsDate = twitterData[j].date
            let tweetsText = twitterData[j].text
            let tweetsCount = twitterData[j].retweet_count
            let tweetsLocation = twitterData[j].user_location           
            nlu.analyze(
                {
                    text: tweetsText, // Buffer or String
                    features: {
                        //Supported languages for sentiment: Arabic, English, French, German, Italian, Korean, Portuguese, Russian, Spanish
                        sentiment: {},
                        //concepts: {},
                        //keywords: {},
                    }
                },  
                sentiment = (err, response) => {
                    if (err) {
                        console.log('error:', err);
                    } else {
                        // let sentiment = {
                        //     label: response.sentiment.document.label,
                        //     score: response.sentiment.document.score,
                        //     text: tweetsText,
                        //     date: tweetsDate,
                        //     count: tweetsCount,
                        //     location: tweetsLocation
                        // };

                        // console.log(sentiment)


                        let sentiment = TwitterWatson({
                            label: response.sentiment.document.label,
                            score: response.sentiment.document.score,
                            text: tweetsText,
                            date: tweetsDate,
                            count: tweetsCount,
                            location: tweetsLocation
                        });
                        sentiment.save()
                            .then(sentimentDB => {
                                console.log(sentimentDB);
                            })
                            .catch(error => {
                                console.log(error)
                            })
                    }
                },
            );
        }
    }
});
}