
class DAOJuegos {

    constructor(pool) {
        this.pool = pool
    }

    leerTodos(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT * from juegos inner join categorias on categorias.id_cat = juegos.id_categoria";
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
                        const sql = "insert into `planificacionesjugadas` (idtarea) values (?)" //la fecha se incluye de forma automatica como current timestamp en bd
                        connection.query(sql, [datosJuego.idTarea], function (err, resultado) {
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
}


module.exports = DAOJuegos
