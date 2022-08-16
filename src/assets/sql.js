var mysql = require("mysql");
var connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.DATABASE_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log("Conectado a base de datos local");
});
module.exports = connection;
