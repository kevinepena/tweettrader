import React, { Component } from "react";

class Tweets extends Component {
    render() {

        var contents = this.props.tweets.map(tweet => {
            return (
                <Tweet key={tweet._id} tweet={tweet} />
            )
        })
        return (
            <ul className="tweets">{content}</ul>
        )
    }
}

export default Tweets;