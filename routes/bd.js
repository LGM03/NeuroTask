const config = require('../config');
const mysql = require("mysql")
const pool = mysql.createPool({ //instancia de acceso a la base de datos 
  host: config.VAR_HOST,
  user: config.VAR_USER,
  password: config.VAR_PASSWORD,
  database: config.VAR_DATABASE, //nombre de la bd
  port : config.VAR_PORT_DB
})

module.exports = pool
