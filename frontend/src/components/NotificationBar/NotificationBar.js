import React from 'react';

const NotificationBar = props = (

    <div className={`notification-bar ${props.count > 0 ? 'active' : ''}`}>
        <p>There are {props.count} new tweets! <a onClick={props.onShowNewTweets} id="moretweets">Click here to see them!</a> </p>
    </div>

)

export default NotificationBar;