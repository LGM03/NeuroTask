const mysql = require("mysql")
const pool = mysql.createPool({ //instancia de acceso a la base de datos 
  host: "localhost",
  user: "root",
  password: "",
  database: "neurotask" //nombre de la bd
})

module.exports = pool