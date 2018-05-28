import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import moment from 'moment';
import {Line as LineChart} from 'react-chartjs';

  function chartData(xAxis, yAxis) {
    return {
      labels: xAxis,
      datasets: [
        {
          scaleFontColor: "#ff0000",
          fontColor: 'orange',
          label: 'My First dataset',
          fillColor: 'rgba(220,220,220,0.2)',
          strokeColor: 'rgba(220,220,220,1)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
          pointHighlightFill: '#fff',
          pointHighlightStroke: 'rgba(220,220,220,1)',
          data: yAxis,
          yAxisID: 'left-y-axis',
        },
      ]
    }
  }
  
  const options = {
    scales: {
      yAxes: [{
          id: 'left-y-axis',
          type: 'linear',
          position: 'left',
          display: true,
      }, {
          id: 'right-y-axis',
          type: 'linear',
          position: 'right',
          display: true,
      }]
    },
    scaleShowGridLines: true,
    scaleGridLineColor: 'rgba(0,0,0,.05)',
    scaleGridLineWidth: 1,
    scaleShowHorizontalLines: true,
    scaleShowVerticalLines: true,
    bezierCurve: true,
    bezierCurveTension: 0.4,
    pointDot: true,
    pointDotRadius: 4,
    pointDotStrokeWidth: 1,
    pointHitDetectionRadius: 20,
    datasetStroke: true,
    datasetStrokeWidth: 2,
    datasetFill: true,
    legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
  }
  
  const styles = {
    graphContainer: {
      //color:'white'
    }
  }
  
  class LineChartExample extends React.Component {
  
    constructor(props) {
      super(props)
      this.state = {
        data: {},
        serverData: [],
        bitcoinData: [],
        yAxis: [],
        yAxis2: [], 
        xAxis: [],
      }
    }

    componentDidMount() {
      axios.get('http://localhost:8080/data')
        .then(result => {
          let newDatafromServer = result.data;
          this.setState({ serverData: newDatafromServer })
        })
        .then(result=>{
          axios.get('http://localhost:8080/bitcoin-price')
          .then(result=>{
            let bitcoinPriceDataFromServer = result.data
            console.log(bitcoinPriceDataFromServer)
            this.setState({ bitcoinData: bitcoinPriceDataFromServer })
          })
          .then(result => {
            this.cleanTWData()
          })
        })
        .catch(error => {
          console.log(error)
        })
    }

    cleanTWData = () => {
      let data = this.state.serverData;
      let sortedData = data.sort(function(a, b){
        let dateA = Number(new Date(a.date))
        let dateB = Number(new Date(b.date))
        return dateA - dateB;
      })
  
      let unique_dates = [];
      let unique_avg = [];
      let sum = 0;
      let count = 0;
      for(let i=0;i<sortedData.length-1;i++){
        let formattedDate = moment(sortedData[i].date).format('YYYY-MM-DD');
        let formattedDateNext = moment(sortedData[i+1].date).format('YYYY-MM-DD');
        let dataScore = sortedData[i].score 
        if(formattedDate === formattedDateNext){
          sum += dataScore
          count += 1
        }
        if(formattedDate !== formattedDateNext){
          // console.log(sum)
          // console.log(count)
          var average = sum / count
          unique_avg.push(average)
          sum = 0;
          count = 0
          unique_dates.push(formattedDate)
        }
      }
      console.log(this.state.bitcoinData)
      let bitcoinPrices = this.state.bitcoinData;
      let sortedBitcoinPrices = bitcoinPrices.sort(function(a, b){
        let dateA = Number(new Date(a.date))
        let dateB = Number(new Date(b.date))
        return dateA - dateB;
      })
      console.log(bitcoinPrices)
      let bitcoinPricesOnly = []
      for(let i=0; i<bitcoinPrices.length; i++){
        bitcoinPricesOnly.push(sortedBitcoinPrices[i].price)
      }

      this.setState({
        yAxis: unique_avg, 
        xAxis: unique_dates,
        dataTW: chartData(unique_dates, unique_avg),
        dataBC: chartData(unique_dates, bitcoinPricesOnly)
      })
    }
  
    render() {

      const showChart = (this.state.xAxis.length > 0) ? <LineChart data={this.state.dataTW} options={options} width="500" height="250" style={{"color":"white"}} /> : console.log('something else')
      const showChart2 = (this.state.xAxis.length > 0) ? <LineChart data={this.state.dataBC} options={options} width="500" height="250"/> : console.log('something else')


      return (
        <div style={styles.graphContainer}>

          <div className="container">
            <div className="row">
              <div className="col-2">
              </div>
              <div className="col-8">
              <center>
              <h1>Bitcoin Sentiment & Price Tracker</h1>
              <h2>Bitcoin Sentiment</h2>
                {showChart}
                </center>
                <center>
                <h2>Bitcoin Price</h2>
                {showChart2}
                <br />
                <br />
                <h3>Powered by IBM Watson's Natural Language Processing, Twitter's API, and Coinbase's API</h3>
                </center>
              </div>
              <div className="col-2">

              </div>
            </div>
          </div>
        </div>
      )
    }
  }
  
  export default LineChartExample;