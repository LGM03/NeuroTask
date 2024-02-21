
const mysql = require("mysql")
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "neurotask"
})

module.exports = pool