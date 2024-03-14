
/*
const mysql = require("mysql")
const pool = mysql.createPool({ //instancia de acceso a la base de datos 
  host: "localhost",
  user: "root",
  password: "",
  database: "neurotask" //nombre de la bd
})

module.exports = pool

*/
const mysql = require("mysql")
const pool = mysql.createPool({ //instancia de acceso a la base de datos 
  host: "b5b0g1c3rrjx6iqzevap-mysql.services.clever-cloud.com",
  user: "uifaywq7zxn9ezvs",
  password: "zB2Dza3JsQwr3iDEW6bs",
  database: "b5b0g1c3rrjx6iqzevap", //nombre de la bd
})

module.exports = pool