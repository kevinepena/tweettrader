const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
// const routes = require("./routes");
const twitter = require('twitter');
const streamHandler = require('./utils/streamHandler');
const config = require("./config");
const cors = require('cors');
const cookieParser = require('cookie-parser');

var twit = new twitter(config.twitter);


// require("dotenv").config();

// if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
//   throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE configured';
// }


const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:3000'
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// This allows us to serve files out of the client/build folder
app.use(express.static("client/build"));

// Add routes, both API and view
// app.use(routes);


// This is a catch all if no other routes are matched
app.use(function (req, res) {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// app.listen(PORT, function () {
//   console.log(`API Server now listening on port ${PORT}`);
// });

// Start the API server
var server = app.listen(PORT, function () {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});

// Initialize socket.io
var io = require('socket.io').listen(server);


// Set a stream listener for tweets matching tracking keywords
twit.stream('statuses/filter', { track: 'FAA' }, function (stream) {
  streamHandler(stream, io);
});