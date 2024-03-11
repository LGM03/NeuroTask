var express = require('express');
var router = express.Router();
const pool = require('./bd')
/* GET home page. */
router.get('/', function (req, res, next) {
  const DAOAp = require("../mysql/daoJuegos")
  const midao = new DAOAp(pool)

  midao.leerTodos((err, datos) => {
    if (err) {
      console.log(err);
    }
    else {
      res.render('index', { juegos : datos, usuario : req.session.usuario});  //Cargo la ventana principal con la información de todos los juegos
    }
  });
});


module.exports = router;
