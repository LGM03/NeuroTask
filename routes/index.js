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
router.get('/', function (req, res, next) {
  const DAOAp = require("../mysql/daoJuegos")
  const midao = new DAOAp(pool)

  midao.leerTodos((err, datos) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(req.session.usuario)
      res.render('index', { juegos : datos, usuario : req.session.usuario, error : req.query.error, exito:req.query.exito });  //Cargo la ventana principal con la información de todos los juegos
    }
  });
});


module.exports = router;
