var express = require('express');
var router = express.Router();

const mysql = require("mysql")
const pool = mysql.createPool({
  host: "localhost",
  user: "admin_aw",
  password: "",
  database: "neurotask"
})


/* GET home page. */
router.get('/', function (req, res, next) {
  
  const DAOAp = require("../mysql/daoJuegos")
  const midao = new DAOAp(pool)

  midao.leerTodos((err, datos) => {
    if (err) {
      console.log(err);
    }
    else {
      res.render('index', { juegos : datos }); 
    }
  });
});


module.exports = router;
