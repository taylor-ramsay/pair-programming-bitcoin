const scrapeTwitter = require('scrape-twitter');

//scrapeTwitter.TweetStream(query: "string", type: 'top' | 'latest', { count: 5 })

//new scrapeTwitter.TweetStream('bitcoin', 'top' | 'latest', { count: 10 })

// var tweet = scrapeTwitter.TweetStream(arg, arg2, arg3) => {
//     console.log('test')
// }

//scrapeTwitter.getUserProfile: (username: 'any') => username

let query = 'bitcoin';

let search = () => {
    return new scrapeTwitter.TweetStream(query, {type: 'latest'}, {count: 100 })
}

console.log(search())

let dani = new scrapeTwitter.TimelineStream({username:'danisubject'}, 
    { retweets: true, replies: true, count: 20 }
)

console.log(dani);