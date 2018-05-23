const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('e5ba05fa0a644ce29888258d1d9ee5af');
// To query /v2/top-headlines
// All options passed to topHeadlines are optional, but you need to include at least one of them
newsapi.v2.everything({
    q: 'bitcoin',
    //sources: 'bbc-news,the-verge',
    //domains: 'bbc.co.uk, techcrunch.com',
    from: '2017-12-01',
    to: '2018-12-12',
    //language: 'en',
    //country: 'us',
    sortBy: 'relevancy',
    page: 2
  }).then(response => {
    console.log(response);
    /*
      {
        status: "ok",
        articles: [...]
      }
    */
  });