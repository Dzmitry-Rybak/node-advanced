const cluster = require("cluster");
const crypto = require("crypto");
const Worker = require("worker-threads".WOrker);

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  const worker = new Worker(function () {
    this.onmessage = function () {
      let counter = 0;
      while (counter < 1e9) {
        counter++;
      }
    };

    postMessage(counter);
  });

  worker.onmessage = function (message) {
    console.log(message.data);
    res.send(" " + message.data);
  };

  worker.postMessage();
});

app.get("/fast", (req, res) => {
  res.send("This was fast!");
});

app.listen(3000);
