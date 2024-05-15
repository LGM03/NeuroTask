const config = require('../config');
const mysql = require("mysql2")

const pool = mysql.createPool({ //instancia de acceso a la base de datos 
  host:  config.VAR_HOST, //host de la bd
  user: config.VAR_USER,  //Usuario de la bd
  password:config.VAR_PASSWORD, //contraseña de usuario de la bd
  database:config.VAR_DATABASE, //nombre de la bd
  port :config.VAR_PORT_DB  //puerto de la bd
})

module.exports = pool
