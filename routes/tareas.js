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
  console.log("servidor "+ data.usuario + " "+ data.dia)

  midao.tareaUsuarioDia(data, (err, datos) => {
    if (err) {
      res.send({});
    }
    else {
      res.send(datos);
    }
  });
});



module.exports = router;
