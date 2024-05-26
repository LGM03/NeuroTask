var express = require('express');
var router = express.Router();

const pool = require('./bd')

//Si soy admin accedo a la ventana de administrador, si no, vuelvo a la inicial
router.get('/', function (req, res, next) { //meter BD aqui

  if(req.session.usuario  != undefined && req.session.usuario.tipo == "terapeuta"){
  res.render("admin", {exito : req.query.exito, error : req.query.error})
  }else{
    res.redirect("/") 
  }
});

// Lista todos lsos pacientes de un terapeuta
router.get('/listarUsuarios', function (req, res, next) { 

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

//Obtengo el listado total de todos los juegos
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
