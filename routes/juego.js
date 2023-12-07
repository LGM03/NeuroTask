var express = require('express');
var router = express.Router();

const mysql = require("mysql")
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "neurotask"
})

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

router.get('/finJuego', function (req, res, next) {

  console.log("He llegado al servidor")

  const daoAp = require('../mysql/daoJuegos')
  midao = new daoAp(pool)

  if (req.session.usuario) { //Si tengo una sesion de usuario registrada

    const datosPartida = {
      idJuego: req.query.idJuego,
      fechaInicio: req.query.fechaInicio,
      aciertos: req.query.aciertos,
      fallos: req.query.fallos,
      duracion: req.query.duracion,
      usuario: req.session.usuario.correo
    }
    console.log(req.query.aciertos + " " + req.query.fallos + " " + req.session.usuario.correo + " " + req.query.idJuego + " " + req.query.fechaInicio + " " + req.query.duracion)
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
