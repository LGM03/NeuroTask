var express = require('express');
var router = express.Router();
const pool = require('./bd')

router.get('/', function (req, res, next) {

  let id = Number(req.query.id)

  const DAOAp = require("../mysql/daoJuegos")
  const midao = new DAOAp(pool)

  midao.leerPorID(id, (err, datos) => {
    if (err) {
      console.log(err);
    }
    else {
      res.render('juego', { juego: datos });
    }
  });
});


router.get('/leerCategorias', function (req, res, next) {

  console.log("A")
  const DAOAp = require("../mysql/daoJuegos")
  const midao = new DAOAp(pool)

  midao.leerCategorias((err, datos) => {
    if (err) {
      console.log(err);
    }
    else {
      res.json(datos)
    }
  });
});

router.get('/finJuego', function (req, res, next) {

  const daoAp = require('../mysql/daoJuegos')
  midao = new daoAp(pool)

  if (req.session.usuario) { //Si tengo una sesion de usuario registrada

    const datosPartida = {
      idJuego: req.query.idJuego,
      fechaInicio: req.query.fechaInicio,
      aciertos: req.query.aciertos,
      fallos: req.query.fallos,
      duracion: req.query.duracion,
      usuario: req.session.usuario.correo,
      nivel : req.query.nivel
    }
    console.log("El id del juego para el servidor es : "+ datosPartida.idJuego)

    midao.guardarPartida(datosPartida, (err, datos) => {
      if (err) {
        console.log(err);
      }
      else {
        res.redirect('/')
      }
    })

  }else{
    res.redirect('/')
  }


});


module.exports = router;
