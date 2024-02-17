var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);

const sessionStore = new MySQLStore({  //donde alamceno las sesiones
  host: "localhost",
  user: "root",
  password: "",
  database: "neurotask"
});

//Manejos de sesiones

const middlewareSession = session({
  saveUninitialized: false,
  secret: "foobar34",
  resave: false,
  store: sessionStore
});

var indexRouter = require('./routes/index');
var juegoRouter = require('./routes/juego');
var adminRouter = require('./routes/admin');
var usuarioRouter = require('./routes/usuario');
var tareasRouter = require('./routes/tareas');
var comentariosRouter = require('./routes/comentarios');

var app = express();
app.use(middlewareSession);

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
