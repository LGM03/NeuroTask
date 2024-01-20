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

  console.log(req.query.exito)
  res.render("admin", {exito : req.query.exito, error : req.query.error})
});


router.get('/listarUsuarios', function (req, res, next) { //meter BD aqui

  const DAOAp = require("../mysql/daoUsuarios")
  const midao = new DAOAp(pool)

  midao.pacientesXTerapeuta(req.session.usuario.correo, (err, datos) => {
    if (err) {
      res.json({});
    }
    else {
      res.json(datos);
    }
  });
});

router.get('/leerJuegos', function (req, res, next) {
  const DAOAp = require("../mysql/daoJuegos")
  const midao = new DAOAp(pool)

  midao.leerTodos((err, datos) => {
    if (err) {
      res.json({})
    }
    else {
      res.json(datos)
    }
  });
});



module.exports = router;
