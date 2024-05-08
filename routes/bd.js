
const mysql = require("mysql")
const pool = mysql.createPool({ //instancia de acceso a la base de datos 
  host: process.env.VAR_HOST,
  user:process.env.VAR_USER,
  password: process.env.VAR_PASSWORD,
  database: process.env.VAR_DATABASE, //nombre de la bd
  port :process.env.VAR_PORT_DB
})

module.exports = pool
