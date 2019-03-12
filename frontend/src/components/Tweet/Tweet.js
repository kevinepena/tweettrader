import React from "react";

const Tweet = props = (

    <li className={"tweet" + (props.tweet.active ? ' active' : '')}>
    <img src={props.tweet.avatar} className="avatar" />
    <blockquote>
        <cite>
            <a href={"http://www.twitter.com/" + props.tweet.screenname}>{props.tweet.author}</a>
            <span className="screen-name">@{props.tweet.screenname}</span>
        </cite>
        <span className="content">{props.tweet.body}</span>
    </blockquote>
</li>

);

export default Tweet;