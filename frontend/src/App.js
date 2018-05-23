import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8080/data')
      .then(result => {
        let newDatafromServer = result.data;
        this.setState({ data: newDatafromServer })
      })
      .catch(error => {
        console.log(error)
      })
  }

  createDateAxis = () => {
    let dates = []
    for(let i=0;i<this.state.data.length;i++){
      dates.push(this.state.data[i].date)
    }
    console.log(dates.sort())
  }

  render() {
    this.createDateAxis()
    return (
      <div className="App">

      </div>
    );
  }
}

export default App;
