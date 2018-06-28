import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import TweetList from './TweetList';
import $ from 'jquery'
import _ from 'lodash'

class LineChartExample extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      data: {},
      serverData: [],
      bitcoinData: [],
      recentNegativeTweets: [],
      recentNeutralTweets: [],
      recentPositiveTweets: [],
      yAxis: [],
      yAxis2: [],
      xAxis: [],
      currentSentiment: null
    }
  }

  getData = () => {
    return axios.get('/data')
  }

  getBTC = () => {
    return axios.get('/bitcoin-price')
  }

  componentDidMount() {

    axios.all([this.getData(), this.getBTC()])
      .then(axios.spread((getData, getBTC) => {
        this.setState({
          serverData: getData.data,
          bitcoinData: getBTC.data
        }, () => {
          this.createChartData()
          this.createTweetData()
        })
      }))
      .catch(error => {
        console.log(error)
      })

  }

  createTweetData = () => {
    let data = this.state.serverData
    console.log(data)
    let positiveTweets = data.filter((el) => {
      if (moment(el.date).isBetween(moment().subtract(7, 'days'), moment()))
        return el.label === "positive"
    })
    let negativeTweets = data.filter((el) => {
      if (moment(el.date).isBetween(moment().subtract(7, 'days'), moment()))
        return el.label === "negative"
    })
    let neutralTweets = data.filter((el) => {
      if (moment(el.date).isBetween(moment().subtract(7, 'days'), moment()))
        return el.label === "neutral"
    })
    let sortedPositiveTweets = _.orderBy(positiveTweets, 'score', 'desc')
    let sortedNegativeTweets = _.sortBy(negativeTweets, 'score')
    let sortedNeutralTweets = _.orderBy(neutralTweets, 'date', 'desc')
    console.log(sortedPositiveTweets)
    this.setState({
      recentPositiveTweets: sortedPositiveTweets,
      recentNegativeTweets: sortedNegativeTweets,
      recentNeutralTweets: sortedNeutralTweets
    })
  }

  createChartData = () => {
    let data = this.state.serverData;
    let sortedData = data.sort(function (a, b) {
      let dateA = Number(new Date(a.date))
      let dateB = Number(new Date(b.date))
      return dateA - dateB;
    })

    let unique_dates = [];
    let unique_avg = [];
    let sum = 0;
    let count = 1;
    for (let i = 0; i < sortedData.length - 1; i++) {
      let formattedDate = moment(sortedData[i].date).format('YYYY-MM-DD');
      let formattedDateNext = moment(sortedData[i + 1].date).format('YYYY-MM-DD');
      let dataScore = sortedData[i].score
      if (formattedDate === formattedDateNext) {
        sum += dataScore
        count += 1
      }
      if (formattedDate !== formattedDateNext) {
        var average = sum / count
        unique_avg.push(parseFloat(average).toFixed(2))
        sum = 0;
        count = 1
        unique_dates.push(formattedDate)
      }
    }
    let bitcoinPrices = this.state.bitcoinData;
    let sortedBitcoinPrices = bitcoinPrices.sort(function (a, b) {
      let dateA = Number(new Date(a.date))
      let dateB = Number(new Date(b.date))
      return dateA - dateB;
    })
    let bitcoinPricesOnly = []
    for (let i = 0; i < bitcoinPrices.length; i++) {
      bitcoinPricesOnly.push(parseFloat(sortedBitcoinPrices[i].price).toFixed(2))
    }

    this.setState({
      yAxisSentiment: unique_avg,
      yAxisBTC: bitcoinPricesOnly,
      xAxis: unique_dates,
      currentSentiment: unique_avg[unique_avg.length - 1]
    })
  }

  render() {
    const data = {
      labels: this.state.xAxis,
      datasets: [{
        data: this.state.yAxisSentiment,
        label: 'Sentiment',
        // This binds the dataset to the left y axis
        yAxisID: 'left-y-axis',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#5A38B4',
        borderColor: '#3E13AF',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: '#3E13AF',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#5A38B4',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
      }, {
        data: this.state.yAxisBTC,
        label: 'Bitcoin Price',
        // This binds the dataset to the right y axis
        yAxisID: 'right-y-axis',
        fill: false,
        lineTension: 0.1,
        backgroundColor: '#FFAE00',
        borderColor: 'gold',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'gold',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: '#FFAE00',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHitRadius: 10,
      }],
    }

    const options = {
      scales: {
        yAxes: [{
          id: 'left-y-axis',
          type: 'linear',
          position: 'left',
        }, {
          id: 'right-y-axis',
          type: 'linear',
          position: 'right',
        }]
      }
    }

    return (
      <div>
        <center>
          <h1>Bitcoin Sentiment</h1>
        </center>
        <div className="card-panel teal2 header-panels">
          <div className="row methodology">
            <div className="col l2">
            </div>
            <div className="col l8 s12">
              <p className="white-text"><span class="highlight-text">Methodology:</span> Each day new information, gossip, fake news, and speculation about Bitcoin is shared and consumed on Twitter. By analyzing popular tweets with AI we can get an average sense of the sentiment for Bitcoin's price (whether positive, negative, or neutral) and determine how this sentiment moves it's price.
              </p>
            </div>
            <div className="col l2">
            </div>
          </div>
        </div>
        <div className="card-panel header-panels blue-background powered-by">
          <div className="row methodology">
            <div className="col l2">
            </div>
            <div className="col l8 s12">
              <p><span class="highlight-text">Powered By:</span> <a className="header-link" href="https://developer.twitter.com/content/developer-twitter/en.html">Twitter API</a>, <a className="header-link" href="https://developers.coinbase.com/">Coinbase API</a>, <a className="header-link" href="https://www.ibm.com/watson/developer/">IBM Watson API</a>
              </p>
            </div>
            <div className="col l2">
            </div>
          </div>
        </div>
        <center>
          <h2>Sentiment & Price</h2>
        </center>
        <div className="row">
          <div className="col l2">
          </div>
          <div className="col s12 l8">
            <center>


<Line data={data} options={options} />

              
            </center>
          </div>
          <div className="col l2">
          </div>
        </div>
        <div className="row">
          <div className="col l2">
          </div>
          <div className="col s12 l8">
            <center>
              <h2>Sentiment Score</h2>

              <h4 className="sentiment-text">{this.state.currentSentiment ? this.state.currentSentiment : ""} <i className="small material-icons sentiment-icon">{this.state.currentSentiment < -.1 ? 'sentiment_very_dissatisfied' : this.state.currentSentiment >= .1 ? 'sentiment_very_satisfied' : 'sentiment_neutral'}</i></h4>
            </center>
            <meter min="-1" low="-.1" high=".1" optimum="1" max="1" value={this.state.currentSentiment}></meter>
          </div>
          <div className="col l2">
          </div>
        </div>
        <div className="row">
          <div className="col l2">
          </div>
          <div className="col s12 l8">
            <center>
              <h2>Recent Tweets</h2>
            </center>
            <TweetList recentNegativeTweets={this.state.recentNegativeTweets} recentNeutralTweets={this.state.recentNeutralTweets} recentPositiveTweets={this.state.recentPositiveTweets} />
          </div>
          <div className="col l2">
          </div>
        </div>
      </div >
    )
  }
}

export default LineChartExample;

