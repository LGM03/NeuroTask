var express = require('express');
var router = express.Router();
const pool = require('./bd')

router.get('/', function (req, res, next) {

  let id = Number(req.query.id)

  if (id == -1) {

    var juego = {
      descripcion: "¡Bienvenido a la planificación de hoy!",
      id : -1  //Cuando hay que reproducir planificación el id es null
    }

    res.render('juego', { juego: juego, esPlan : true })

  } else {
    const DAOAp = require("../mysql/daoJuegos")
    const midao = new DAOAp(pool)

    midao.leerPorID(id, (err, datos) => {
      if (err) {
        console.log(err);
      }
      else {
        res.render('juego', { juego: datos, esPlan : false});
      }
    });
  }
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
      nivel: req.query.nivel
    }
    console.log("El id del juego para el servidor es : " + datosPartida.idJuego)

    midao.guardarPartida(datosPartida, (err, datos) => {
      if (err) {
        console.log(err);
      }
      else {
        res.redirect('/')
      }
    })

  } else {
    res.redirect('/')
  }


});

router.get('/finPlan', function (req, res, next) {

  const daoAp = require('../mysql/daoJuegos')
  midao = new daoAp(pool)

    const datosPartida = {
      idJuego: req.query.idJuego,
      fechaInicio: req.query.fechaInicio,
      aciertos: req.query.aciertos,
      fallos: req.query.fallos,
      duracion: req.query.duracion,
      usuario: req.session.usuario.correo,
      nivel: req.query.nivel,
      plan : req.query.plan
    }

    console.log(datosPartida)

    midao.guardarPartidaPlan(datosPartida, (err, datos) => {
      if (err) {
        console.log(err);
      }
      else { //Redirijo a juego indice -1 para seguir con la planificación
        res.redirect('/juego?id=-1')
      }
    })

});



module.exports = router;
