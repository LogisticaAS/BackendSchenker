const express = require('express');
const app = express();
const port = 3001;
const xml2js = require("xml2js");
const path = require("path");
var bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cors());
app.use(express.static(path.join(__dirname, "./public")));

//Routes
app.use(require('./routes/index.js'));


app.listen(port, () => {
    console.log('Server listening on port: ', port)
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, OPTIONS, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  next();
});