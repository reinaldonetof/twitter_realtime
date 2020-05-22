require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

const Twit = require("twit");
const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

const streams = {};

const createStream = (term) => {
  const stream = T.stream("statuses/filter", { track: term });
  stream.on("tweet", (tweet) => {
    io.to(term).emit("tweet", {
      username: tweet.user.name,
      text: tweet.text,
      term,
    });
  });
  streams[term] = stream;
};

const checkStreams = () => {
  const terms = Object.keys(streams);
  terms
    .filter((t) => !(t in io.sockets.adapter.rooms))
    .map((t) => {
      streams[t].stop();
      delete streams[t];
    });
};

io.on("connection", (socket) => {
  socket.on("startStream", (term) => {
    if (!(term in streams)) {
      createStream(term);
    }
    socket.join(term);
  });
  socket.on("disconnect", (reason) => {
    checkStreams();
  });
});

app.get("/", (req, res) => {
  res.render("home");
});

http.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server running...");
  }
});
