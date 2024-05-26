
class DAOJuegos {

    constructor(pool) {
        this.pool = pool
    }

    //Lee la informacion de todos los juegos
    leerTodos(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT * from juegos inner join categorias on categorias.id_cat = juegos.id_categoria ORDER by id";
                connection.query(sql, null, function (err, resultado) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, resultado);
                    }
                });
            }
        });
    }
    //Lee la informacion de un juego por su ID
    leerPorID(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT * from juegos where id = ?";
                connection.query(sql, [id], function (err, resultado) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, resultado[0]);
                    }
                });
            }
        });
    }
    //Lee todas las categorias disponibles
    leerCategorias(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT * FROM categorias;";
                connection.query(sql, null, function (err, resultado) {
                    connection.release();
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, resultado);
                    }
                });
            }
        });
    }
    //Guardo el resultado de una partida
    guardarPartida(datosJuego, callback) {  //Almaceno la durancion en s, usar momento.js para humanizar 
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null)
            } else {
                const sql = "insert into `partidas` (idJ,idP,fechaInicio,duracion,aciertos,fallos,nivel) values(?,?,?,?,?,?,?)"
                const fechaSQL = new Date(datosJuego.fechaInicio).toISOString().slice(0, 19).replace("T", " ");
                connection.query(sql, [datosJuego.idJuego, datosJuego.usuario, fechaSQL, datosJuego.duracion, datosJuego.aciertos, datosJuego.fallos, datosJuego.nivel], function (err, resultado) {
                    connection.release();
                    if (err) {
                        callback(err, null)
                    } else {
                        callback(null, resultado)
                    }
                })
            }
        })
    }
    //Guarda la informacion de una partida que forma parte de un plan
    guardarPartidaPlan(datosJuego, callback) {  //Almaceno la durancion en s, usar momento.js para humanizar 
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null)
            } else {
                const sql = "insert into `partidas` (idJ,idP,fechaInicio,duracion,aciertos,fallos,nivel,idTarea) values(?,?,?,?,?,?,?,?)"
                const fechaSQL = new Date(datosJuego.fechaInicio).toISOString().slice(0, 19).replace("T", " ");
                connection.query(sql, [datosJuego.idJuego, datosJuego.usuario, fechaSQL, datosJuego.duracion, datosJuego.aciertos, datosJuego.fallos, datosJuego.nivel, datosJuego.idTarea], function (err, resultado) {
                    if (err) {
                        connection.release();
                        callback(err, null)
                    } else {
                        const sql = "insert into `planificacionesjugadas` (idtarea,fecha) values (?,?)" //la fecha se incluye de forma automatica como current timestamp en bd
                        connection.query(sql, [datosJuego.idTarea,new Date()], function (err, resultado) {
                            connection.release();
                            if (err) {
                                callback(err, null)
                            } else {
                                callback(null, 1)
                            }
                        })
                    }
                })
            }
        })
    }
    //Lee los juegos en funcion de la categoria
    leerjuegosCategorias(categoria, callback) {  //Almaceno la durancion en s, usar momento.js para humanizar 
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null)
            } else {
                const sql = "select id,nombre from juegos where id_categoria= ?"
                connection.query(sql, [categoria], function (err, resultado) {
                    connection.release();
                    if (err) {
                        callback(err, null)
                    } else {
                        callback(null, resultado)
                    }
                })
            }
        })
    }
}


module.exports = DAOJuegos
