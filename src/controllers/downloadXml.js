var express = require("express");
var app = express();
var convert = require("xml-js");
const fs = require("fs");
const path = require("path");
var format = require("xml-formatter");
const xml2js = require("xml2js");
const readXlsxFile = require("read-excel-file/node");
const con = require("../assets/sql");

const downloadXmlController = (req, res, next) => {
    const name = req.body.name;
    console.log(name);
    var filePath = path.join(__dirname, `../files/${name}`);
    res.sendFile(filePath);
    
}


module.exports = {
    downloadXmlController
}