require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

console.log(process.env.CONSUMER_KEY);

const Twit = require("twit");
const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
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
