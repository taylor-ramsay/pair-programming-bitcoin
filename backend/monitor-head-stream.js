const TimelineStream =  require('scrape-twitter')
const JSONStream = require('JSONStream')
const pump = require('pump')
var fs = require('fs')

const monitorHeadStream = require('monitor-head-stream')

const createStream = () => new TimelineStream.TweetStream('bitcoin', {type: 'top'}, {count: 1 })
const indexBy = obj => obj.id
const skipWhenPinned = obj => obj.isPinned === true

let myArray = [];
var stream = fs.createReadStream('data.json', {encoding: 'utf8'}),
    parser = JSONStream.stringify(false);

pump(
    monitorHeadStream.default(createStream, indexBy, skipWhenPinned),
    stream.pipe(parser),
    process.stdout
    //.pipe(csvToJson)
    //.pipe(parser)
    //.pipe(jsonToStrings)
    //.pipe(process.stdout)
)