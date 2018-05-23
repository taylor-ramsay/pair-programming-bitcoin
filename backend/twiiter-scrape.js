const twitter = require('scrape-twitter')
const JSONStream = require('JSONStream')
const pump = require('pump')
const monitorHeadStream = require('monitor-head-stream')

//var ts = new TweetStream(query: "bitcoin", type: 'top' | 'latest', { count: 10 })

let dani = new twitter.TimelineStream({username:'danisubject'}, 
    { retweets: true, replies: true, count: 20 }
)

let ts = new twitter.Twit("bitcoin", {type:"latest"}, {count:1})
