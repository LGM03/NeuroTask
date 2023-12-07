var express = require('express');
var router = express.Router();

const mysql = require("mysql")
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "neurotask"
})


/* GET home page. */
router.get('/', function (req, res, next) { //meter BD aqui

    const DAOAp = require("../mysql/daoUsuarios")
    const midao = new DAOAp(pool)
  
    midao.leerTodos((err, datos) => {
      if (err) {
        console.log(err)
      }
      else {
        res.render('admin', { datos : datos}); 
      }
    });
});


module.exports = router;
