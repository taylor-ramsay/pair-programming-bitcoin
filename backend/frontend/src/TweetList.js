import React, { Component } from 'react';
import moment from 'moment';

class TweetList extends Component {

    render() {


        if (this.props.recentPositiveTweets.length > 0) {
            var positiveTweetslistJSX = this.props.recentPositiveTweets.map((tweet, i) => {
                return (
                    <div className="card horizontal">
                        <div className="card-stacked">
                            <div className="card-content">
                                <p>{tweet.text}</p>
                            </div>
                            <div className="card-action">
                            <span>{moment(tweet.date).format("MMM DD")}</span>
                                <span className="right">Score: {tweet.score.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )
            })
            var negativeTweetslistJSX = this.props.recentNegativeTweets.map((tweet, i) => {
                return (
                    <div className="card horizontal">
                        <div className="card-stacked">
                            <div className="card-content">
                                <p>{tweet.text}</p>
                            </div>
                            <div className="card-action">
                            <span>{moment(tweet.date).format("MMM DD")}</span>
                                <span className="right">Score: {tweet.score.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )
            })
            var neutralTweetslistJSX = this.props.recentNeutralTweets.map((tweet, i) => {
                return (
                    <div className="card horizontal">
                        <div className="card-stacked">
                            <div className="card-content">
                                <span>{tweet.text}</span>
                            </div>
                            <div className="card-action">
                                <span>{moment(tweet.date).format("MMM DD")}</span>
                                <span className="right">Score: {tweet.score.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )
            })
        }

        return (
            <div>
            <div className="col s12 l4">
                <h4 className="header positive">Positive[{this.props.recentPositiveTweets.length}]</h4>
                {positiveTweetslistJSX}
            </div>
            <div className="col s12 l4">
                <h4 className="header neutral">Neutral[{this.props.recentNeutralTweets.length}]</h4>
                {neutralTweetslistJSX}
            </div>
            <div className="col s12 l4">
                <h4 className="header negative">Negative[{this.props.recentNegativeTweets.length}]</h4>
                {negativeTweetslistJSX}
            </div>
            </div>
        );
    }
}

export default TweetList;
