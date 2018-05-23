const fs = require('fs');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const axios = require('axios')
const apiCred = require('./api-credentials.js')

var nlu = new NaturalLanguageUnderstandingV1({
    username: "9ad2c2d3-015a-4fc9-8c69-f4283e5ed194",
    password: "0W7Xsw8kvfaA",
    version: '2018-04-05',
    url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

nlu.analyze(
    {
      text: "Crypto meltdown: Bitcoin, Ethereum, Ripple, and Bitcoin Cash smashed on Bing ba", // Buffer or String
      features: {
        //Supported languages for sentiment: Arabic, English, French, German, Italian, Korean, Portuguese, Russian, Spanish
        sentiment: {},
        //concepts: {},
        //keywords: {},
      }
    },
    function(err, response) {
      if (err) {
        console.log('error:', err);
      } else {
        console.log(JSON.stringify(response, null, 2));
      }
    }
);

//test git