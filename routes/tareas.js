var express = require('express');
var router = express.Router();

const mysql = require("mysql")
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "neurotask"
})


//Accede a la base de datos buscando todas las tareas de un usuario para un dia concreto
router.get('/tareaUsuarioDia', function (req, res, next) { 
   
  const DAOAp = require("../mysql/daoTareas")
  const midao = new DAOAp(pool)

  var data = {
    usuario : req.query.usuario,
    dia : req.query.dia
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

router.get('/partidasUsuario', function (req, res, next) { 
   
  const DAOAp = require("../mysql/daoTareas")
  const midao = new DAOAp(pool)


  req.query.usuario
  midao.historialUsuario( req.query.usuario, (err, datos) => {
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



module.exports = router;
