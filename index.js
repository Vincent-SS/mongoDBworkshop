const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

var app = express();

var url = process.env.MONGODB_CONNECT;

mongoose
  .connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    // This allows to return json for routes
    app.use(express.json());
    app.use("/", routes);
    app.listen(9000, () => {
      console.log("Server started");
      console.log("Listening on port 9000");
    })
  })