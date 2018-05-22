var Twitter = require('twitter');
 
var client = new Twitter({
  consumer_key: 'juyQWGeqBeGVRadSVbHTLtqGv',
  consumer_secret: 'cdXNptv5whKowO7otpJqRjuxuCjSkdwEf3VpOlhubqQracEdXZ',
  access_token_key: '929507592057032706-SXqNSbIdXrxg0S4lQbcza5C19pVxcLF',
  access_token_secret: 'gPCtGKnIspYHa6kCTMTSx5s24m1xLGRklutXRHsvKThFk'
});
 
var params = {q: 'bitcoin', lang: 'en', result_type: 'popular'};
client.get('search/tweets', params, function(error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});