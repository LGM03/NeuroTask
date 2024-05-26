var express = require('express');
var router = express.Router();
const pool = require('./bd')
//Accede a la base de datos buscando todas las tareas de un usuario para un dia concreto
router.get('/tareaUsuarioDia', function (req, res, next) {

  const DAOAp = require("../mysql/daoTareas")
  const midao = new DAOAp(pool)

  var data = {
    usuario: req.query.usuario,
    dia: req.query.dia
  }

  midao.tareaUsuarioDia(data, (err, datos) => {
    if (err) {
      res.send({});
    }
    else {
      res.send(datos);
    }
  });
});
 //obtiene todas las tareas de un dia (realizadas y no realizadas)
router.get('/tareaPlan', function (req, res, next) {

  if (req.session.usuario != undefined) {
    const DAOAp = require("../mysql/daoTareas")
    const midao = new DAOAp(pool)

    var data = {
      usuario: req.session.usuario.correo,
      dia: req.query.dia
    }
    midao.tareaUsuarioDia(data, (err, datos) => {
      if (err) {
        res.send({});
      }
      else {
        res.send(datos);
      }
    });
  }else{
    res.send({})
  }
});  

//obtiene las tareas a realizar ese dia (no realizadas)
router.get('/tareaPrimera', function (req, res, next) { 

    const DAOAp = require("../mysql/daoTareas")
    const midao = new DAOAp(pool)

    var data = {
      usuario: req.session.usuario.correo,
      dia: new Date().toISOString().slice(0, 10)
    }
    midao.tareaPendienteDia(data, (err, datos) => {
      if (err) {
        res.send({});
      }
      else {
        res.send(datos);
      }
    });

});  

//Guarda las partidas de un usuario
router.get('/partidasUsuario', function (req, res, next) {

  const DAOAp = require("../mysql/daoTareas")
  const midao = new DAOAp(pool)

  midao.historialUsuario(req.query.usuario, (err, datos) => {
    if (err) {
      res.send({});
    }
    else {
      res.send(datos);
    }
  });
});
//Accede a las planificaciones jugadas
router.get('/planificacionesJugadas', function (req, res, next) {

  const DAOAp = require("../mysql/daoTareas")
  const midao = new DAOAp(pool)

  var data =
    { usuario: req.query.usuario, categoria: req.query.categoria, fecha: req.query.fecha }
 
  midao.planificacionesJugadas(data, (err, datos) => {
    if (err) {
      res.send({});
    }
    else {
      res.send(datos);
    }
  });
});
 //Se ve el rendimiento general del usuario
router.get('/rendimientoGeneral', function (req, res, next) {

  const DAOAp = require("../mysql/daoTareas")
  const midao = new DAOAp(pool)

  var data =
    { usuario: req.query.usuario }
  midao.rendimientoGeneral(data, (err, datos) => {
    if (err) {
      res.send({});
    }
    else {
      res.send(datos);
    }
  });
});
//Se ve el rendimiento general del usuario por categoria
router.get('/progresoCategoria', function (req, res, next) { 

  const DAOAp = require("../mysql/daoTareas")
  const midao = new DAOAp(pool)

  var data = {
    usuario: req.query.usuario,
    categoria: req.query.categoria,
    fecha: req.query.fecha

  }

  midao.progresoCategoria(data, (err, datos) => {
    if (err) {
      res.send({});
    }
    else {
      res.send(datos);
    }
  });
});   

//Se ve el rendimiento general del usuario para un juego
router.get('/progresoJuegoConcreto', function (req, res, next) { 

  const DAOAp = require("../mysql/daoTareas")
  const midao = new DAOAp(pool)

  var data = {
    usuario: req.query.usuario,
    juego: req.query.juego,
    fecha: req.query.fechaSeleccionada
  }

  midao.progresoJuego(data, (err, datos) => {
    if (err) {
      res.send({});
    }
    else {
      res.send(datos);
    }
  });
}); 

//Se ve el rendimiento general del usuario para un juego en funcion de sus meses
router.get('/progresoJuegoTotal', function (req, res, next) {

  const DAOAp = require("../mysql/daoTareas")
  const midao = new DAOAp(pool)

  var data = {
    usuario: req.query.usuario,
    juego: req.query.juego
  }

  midao.progresoTotal(data, (err, datos) => {
    if (err) {
      res.send({});
    }
    else {
      res.send(datos);
    }
  });
}); 

//Accede a la base de datos borrando la tarea con el id dado
router.delete('/eliminar', function (req, res, next) {

  const DAOAp = require("../mysql/daoTareas")
  const midao = new DAOAp(pool)

  var id = req.body.id

  midao.borrarTarea(id, (err, datos) => {
    if (err) {
      res.json(0);
    }
    else {
      res.json(1);
    }
  });
});
//asigna una tarea aun paciente 
router.post('/asignar', function (req, res, next) {

  const DAOAp = require("../mysql/daoTareas")
  const midao = new DAOAp(pool)

  var data = {
    usuario: req.body.usuario,
    juego: req.body.juego,
    seRepite: req.body.seRepite,
    fecha: req.body.fecha,
    terapeuta: req.session.usuario.correo,
    nivel: req.body.nivel
  }
  
  midao.asignarTarea(data, (err, datos) => {
    if (err) {
      res.json(0);
    }
    else {
      res.json(1);
    }
  });
});



module.exports = router;
