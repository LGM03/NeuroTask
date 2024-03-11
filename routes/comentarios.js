var express = require('express');
var router = express.Router();
const pool = require('./bd')

router.get('/leerPorUsuario', function (req, res, next) { //meter BD aqui

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


router.post('/publicar', function (req, res, next) {
    const DAOAp = require("../mysql/daoComentarios")
    const midao = new DAOAp(pool)
    
    var data = {
      usuario: req.body.usuario,
      comentario : req.body.comentario,
      terapeuta: req.session.usuario.correo
    }

    
    midao.publicar(data, (err, datos) => {
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
