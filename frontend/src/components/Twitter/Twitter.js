import React, { Component } from "react";
import Tweets from "../../components/Tweets";
import Loader from "../../components/Loader";
import NotificationBar from "../../components/NotificationBar";
import "./Twitter.css";
import axios from "axios";
import io from 'socket.io-client';


class Twitter extends Component {
    state = {
        tweets: [],
        count: 0,
        page: 0,
        paging: false,
        skip: 0,
        done: false
    };

    constructor(props) {
        super(props);
        this.addTweet = this.addTweet.bind(this);
        this.showNewTweets = this.showNewTweets.bind(this);
        this.loadPagedTweets = this.loadPagedTweets.bind(this);
        this.checkWindowScroll = this.checkWindowScroll.bind(this);

    }




    // refreshBlogs() {
    //   console.log("this should go!");
    //   // API.getArticle().then(res => {
    //   //   console.log(res.data);
    //   //   this.setState({ blogs: res.data });
    //   // });
    // }



    // updateblog(blog){
    //   const blogs = {...this.state.blogs};
    //   blogs[blog.id] = blog;
    //   this.setState({blogs});
    // }



    componentDidMount() {

        this.getTweets(10);

        var self = this;

        // // Initialize socket.io
        var socket = io.connect();

        // On tweet event emission...
        socket.on('tweet', function (data) {

            // Add a tweet to our queue
            self.addTweet(data);

        });

        // Attach scroll event to the window for infinity paging
        window.addEventListener('scroll', this.checkWindowScroll);


        // this.blogRef = base.syncState('blogs', {
        //   context: this,
        //   state: 'blogs'
        // });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.checkWindowScroll)
    }

    getTweets(num) {
        axios.get("/api/tweets")
            .then(res => {
                for (let i = 0; i < num; i++) {
                    this.state.tweets.push(res.data[i])
                }
            }
            )
            .catch(err => console.log(err));
    }

    // Method to add a tweet to our timeline
    addTweet(tweet) {

        // Get current application state
        var updated = this.state.tweets;

        // Increment the unread count
        var count = this.state.count + 1;

        // Increment the skip count
        var skip = this.state.skip + 1;

        // Add tweet to the beginning of the tweets array
        updated.unshift(tweet);

        // Set application state
        this.setState({ tweets: updated, count: count, skip: skip });

    }


    // Method to show the unread tweets
    showNewTweets() {

        // Get current application state
        var updated = this.state.tweets;

        // Mark our tweets active
        updated.forEach(function (tweet) {
            tweet.active = true;
        });

        // Set application state (active tweets + reset unread count)
        this.setState({ tweets: updated, count: 0 });

    }

    // Method to load tweets fetched from the server
    loadPagedTweets(tweets) {

        // So meta lol
        var self = this;

        // If we still have tweets...
        if (tweets.length > 0) {

            // Get current application state
            var updated = this.state.tweets;

            // Push them onto the end of the current tweets array
            tweets.forEach(function (tweet) {
                updated.push(tweet);
            });

            // This app is so fast, I actually use a timeout for dramatic effect
            // Otherwise you'd never see our super sexy loader svg
            setTimeout(function () {

                // Set application state (Not paging, add tweets)
                self.setState({ tweets: updated, paging: false });

            }, 1000);

        } else {

            // Set application state (Not paging, paging complete)
            this.setState({ done: true, paging: false });

        }
    }

    // Method to check if more tweets should be loaded, by scroll position
    checkWindowScroll() {

        // Get scroll pos & window data
        var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        var s = (document.body.scrollTop || document.documentElement.scrollTop || 0);
        var scrolled = (h + s) > document.body.offsetHeight;
        // If scrolled enough, not currently paging and not complete...
        if (scrolled && !this.state.paging && !this.state.done) {

            // Set application state (Paging, Increment page)
            this.setState({ paging: true, page: this.state.page + 1 });

            // // Get the next page of tweets from the server
            // this.getPage(this.state.page);

        }
    }

    checkPage() {
        const homeLocation = "/";
        const location = this.props.location.pathname;

        if (location !== homeLocation) {
            console.log(`This is your Route location: ${location}`);
        } else {
            console.log("this is the home route");
        }
    }

    render() {
        return (
            <div className="tweets-container col-sm-12 col-md-6 col-lg-4">
                <h1 className="home-h1">Trending Now </h1>

                <section className="tweets-app">
                    <div className="notificationBar">
                        <NotificationBar count={this.state.count} onShowNewTweets={this.showNewTweets} />
                    </div>
                    <Tweets tweets={this.state.tweets} />
                    <Loader paging={this.state.paging} />
                </section>
            </div>
        );
    }
}

export default Twitter;