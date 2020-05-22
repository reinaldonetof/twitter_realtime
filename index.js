const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const port = process.env.PORT || 3000;

http.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server running...");
  }
});
