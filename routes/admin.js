var express = require('express');
var router = express.Router();

const pool = require('./bd')

/* GET home page. */
router.get('/', function (req, res, next) { //meter BD aqui

  if(req.session.usuario  != undefined && req.session.usuario.tipo == "terapeuta"){
  res.render("admin", {exito : req.query.exito, error : req.query.error})
  }else{
    res.redirect("/")
  }
});


router.get('/listarUsuarios', function (req, res, next) { //meter BD aqui

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


router.get('/generar-url', (req, res) => { //generacion de url y token para inicio de sesión 
  const userId = req.query.id//req.query.usuario; // Obtener el ID del usuario

  if (req.session.usuario.tipo == "terapeuta") { //Compruebo que quien quere acceder es un terapeuta
    // Verificar si el usuario existe en la base de datos
    pool.getConnection(function (err, connection) {
      if (err) {
        callback(err, null);
      } else {
        const sql = 'SELECT * FROM usuario WHERE correo = ?';
        connection.query(sql, [userId], (error, results) => { //busco el token en la bd 
          if (error) {
            console.error('Error al consultar la base de datos:', error);
            res.status(500).send('Error al generar la URL de inicio de sesión automático');
            return;
          }
          if (results.length === 0) {
            res.status(404).send('Usuario no encontrado');
            return;
          }

          // Obtener el token del usuario (si ya tiene uno)
          const usuario = results[0];
          let token = usuario.token;

          // Si el usuario no tiene un token, generar uno nuevo
          if (!token) {
            token = crypto.randomBytes(16).toString('hex');
            // Actualizar el token en la base de datos para el usuario específico
            const updateSql = 'UPDATE usuario SET token = ? WHERE correo = ?';
            connection.query(updateSql, [token, userId], (updateError, updateResults) => {
              if (updateError) {
                console.error('Error al actualizar el token en la base de datos:', updateError);
                res.status(500).send('Error al generar la URL de inicio de sesión automático');
                return;
              }
              generarUrlInicioSesion(token);
            });
          } else {
            generarUrlInicioSesion(token);
          }

          // Función para generar la URL de inicio de sesión automático
          function generarUrlInicioSesion(token) {
            // Construir la URL de inicio de sesión automático
            const loginUrl = `${req.protocol}://${req.get('host')}/iniciar-sesion?token=${token}`;
            res.send(`URL de inicio de sesión automático para usuario ID ${userId}: ${loginUrl}`);
          }
        });
      }
    })

  } else {
    res.status(403).send('Acceso denegado');
  }
});




module.exports = router;
