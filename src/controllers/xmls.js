var express = require("express");
var app = express();
var convert = require("xml-js");
const fs = require("fs");
const path = require("path");
var format = require("xml-formatter");
const xml2js = require("xml2js");
const readXlsxFile = require("read-excel-file/node");
const con = require("../assets/sql");

const xmlsController = (req, res) =>{
     con.query(
       "SELECT * FROM document",
       (error, results) => {
         if (error) throw error;
         if (results[0]) {
         }
         var validFiles = results.filter(file => file.valid == 1);
         var invalidFiles = results.filter((file) => !file.valid == 0);

         return res.status(200).json({ status: "ok", validFiles, invalidFiles });
       }
     );
}



module.exports = {
    xmlsController
} 