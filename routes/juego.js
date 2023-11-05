var express = require('express');
var router = express.Router();

const mysql = require("mysql")
const pool = mysql.createPool({
  host: "localhost",
  user: "admin_aw",
  password: "",
  database: "neurotask"
})

router.get('/', function(req, res, next) {

  let id = Number(req.query.id)

  const DAOAp = require("../mysql/daoJuegos")
  const midao = new DAOAp(pool)

  midao.leerPorID(id, (err, datos) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(datos.descripcion)
      console.log(datos.id)
      console.log(req.query.id)
      res.render('juego', { juego : datos}); 
    }
  });
});

module.exports = router;
