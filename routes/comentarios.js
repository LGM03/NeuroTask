var express = require('express');
var router = express.Router();
const pool = require('./bd')

//Leo todos los comentarios hechos a un paciente
router.get('/leerPorUsuario', function (req, res, next) { 

  const DAOAp = require("../mysql/daoComentarios")
  const midao = new DAOAp(pool)

  midao.leerPorUsuario(req.query.usuario, (err, datos) => {
    if (err) {
      res.json({});
    }
    else {
      res.json(datos);
    }
  });
});

//Inserto un nuevo comentario
router.post('/publicar', function (req, res, next) {
    const DAOAp = require("../mysql/daoComentarios")
    const midao = new DAOAp(pool)
    
    var data = { //Recojo la info del comentario, fecha por defecto current al insertar
      usuario: req.body.usuario,
      comentario : req.body.comentario,
      terapeuta: req.session.usuario.correo
    }
  
    midao.publicar(data, (err, datos) => { 
      //Si sale bien, devuelvo los datos del comentario para actualizar la vista
      if (err) {
        res.json(0);
      }
      else {
        res.json({ comentario : req.body.comentario,
            idT: req.session.usuario.correo,fecha : new Date()});
      }
    });
  });
  

module.exports = router;
