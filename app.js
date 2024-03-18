var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const pool = require('./routes/bd')
const crypto = require('crypto')

const sessionStore = new MySQLStore({
  clearExpired: true,
  checkExpirationInterval: 900000, // Intervalo de comprobación de expiración en milisegundos (15 minutos)
  expiration: 86400000, // Tiempo de expiración predeterminado en milisegundos (1 día)
}, pool);

const middlewareSession = session({
  secret: "foobar34", // Clave secreta para firmar la sesión
  resave: false, // Evitar que se guarde la sesión si no se ha modificado
  saveUninitialized: false, // Evitar que se guarde una sesión no inicializada
  store: sessionStore // Almacenar sesiones en la base de datos MySQL
});

app.use(middlewareSession);

var indexRouter = require('./routes/index');
var juegoRouter = require('./routes/juego');
var adminRouter = require('./routes/admin');
var usuarioRouter = require('./routes/usuario');
var tareasRouter = require('./routes/tareas');
var comentariosRouter = require('./routes/comentarios');

// view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));//estaba a false, lo cambio a true
app.use(cookieParser());

app.use(function (req, res, next) {
  res.locals.usuario = req.session.usuario || null;
  next();
});

app.use('/', indexRouter);
app.use('/juego', juegoRouter);
app.use('/admin', adminRouter);
app.use('/user', usuarioRouter);
app.use('/tareas', tareasRouter);
app.use('/comentarios', comentariosRouter);


app.get('/generar-url', (req, res) => {
  const userId = req.query.usuario//req.query.usuario; // Obtener el ID del usuario

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
            res.send(loginUrl);
          }
        });
      }
    })

  } else {
    res.status(403).send('Acceso denegado');
  }
});

app.get('/iniciar-sesion', (req, res) => {
  const token = req.query.token; // Obtener el token de la URL de inicio de sesión automático

  // Verificar si el token es válido buscando el usuario asociado en la base de datos
  pool.getConnection(function (err, connection) {
    if (err) {
      callback(err, null);
    } else {
      const sql = 'SELECT * FROM usuario WHERE token = ?';
      connection.query(sql, [token], (error, results) => {
        if (error) {
          console.error('Error al consultar la base de datos:', error);
          res.status(500).send('Error al iniciar sesión');
          return;
        }

        if (results.length === 0) {
          res.status(404).send('Usuario no encontrado');
          return;
        }

        // Usuario encontrado, iniciar sesión automáticamente
        const usuario = results[0];
        req.session.usuario = {
          nombre: usuario.nombre,
          correo: usuario.correo,
          tipo : "paciente",
          edad : usuario.edad
      }
        res.redirect('/')
      });
    }
  })
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
