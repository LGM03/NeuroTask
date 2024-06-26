
class DAOTareas {

    constructor(pool) {
        this.pool = pool
    }
    //lee las treas que un usuario tiene asignadas a un dia concreto
    tareaUsuarioDia(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT categoria, (select count(*) from planificacionesjugadas where planificacionesjugadas.idTarea = calendario.idTarea) as hecho, nombre, idTarea, nivel, juegos.id as idJuego from calendario inner join juegos on idJ = juegos.id inner join categorias on categorias.id_cat = juegos.id_categoria where idP = ? and " +
                    " ( fecha = ? or (seRepite = true and fecha = 0000-00-00) or (DAYOFWEEK(fecha) = DAYOFWEEK(?) and seRepite = true)) "
                    ;
                connection.query(sql, [datos.usuario, datos.dia, datos.dia], function (err, resultado) {
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
    //Lee las tareas pendientes para un dia y paciente
    tareaPendienteDia(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT idTarea, nivel, juegos.id as idJuego from calendario inner join juegos on idJ = juegos.id inner join categorias on categorias.id_cat = juegos.id_categoria where idP = ?  and  not exists (select * from planificacionesjugadas where planificacionesjugadas.idTarea = calendario.idTarea) and " +
                    " ( fecha = ? or (seRepite = true and fecha = 0000-00-00) or (DAYOFWEEK(fecha) = DAYOFWEEK(?) and seRepite = true))"
                    ;
                connection.query(sql, [datos.usuario, datos.dia, datos.dia], function (err, resultado) {
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
    //Lee el historial de partidas de un usuario
    historialUsuario(usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT categoria, nombre, fechaInicio, aciertos, fallos,duracion , nivel from juegos inner join partidas on idJ = juegos.id inner join categorias on categorias.id_cat = juegos.id_categoria where idP = ? order by fechaInicio desc";
                connection.query(sql, [usuario], function (err, resultado) {
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
    //Lee las planificaciones que ha jugado un paciente
    planificacionesJugadas(datos, callback) { 
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {

                const sql = "SELECT COUNT(planificacionesjugadas.idTarea) AS hecho, COUNT(calendario.idTarea) - COUNT(planificacionesjugadas.idTarea) AS contador FROM "+
                "calendario LEFT JOIN planificacionesjugadas ON calendario.idTarea = planificacionesjugadas.idTarea  inner join juegos on idJ = juegos.id  where idP = ? and month(calendario.fecha) = ?  and  id_categoria = ? ";
                connection.query(sql, [datos.usuario, datos.fecha,datos.categoria], function (err, resultado) {
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
    //Lee el redimiento general de un paciente en comparacion con el resto de usuario de un mismo grado de deterioro
    rendimientoGeneral(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT categoria, sum(aciertos) / (sum(aciertos) + sum(fallos)) AS aciertos FROM partidas inner join juegos on idJ = juegos.id  inner join categorias on id_categoria =id_cat where idP = ? GROUP BY id_categoria";
                connection.query(sql, [datos.usuario], function (err, resultado) {
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
    //Lee el progreso de un paciente en una categoria en comparación con el resto de paciente de su mismo grado de deterioro
    progresoCategoria(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT WEEK(fechaInicio, 3) AS semana," +
                "SUM(aciertos) / (SUM(aciertos) + SUM(fallos)) AS tasaAciertos," +
                "avg_tasa.tasaMediaAciertos FROM partidas " +
                "INNER JOIN juegos ON idJ = juegos.id " +
                "INNER JOIN categorias ON id_categoria = id_cat " +
                "LEFT JOIN (" +
                    "SELECT WEEK(fechaInicio, 3) AS semana, " +
                    "AVG(aciertos / (aciertos + fallos)) AS tasaMediaAciertos " +
                    "FROM partidas " +
                    "INNER JOIN juegos ON idJ = juegos.id " +
                    "INNER JOIN categorias ON id_categoria = id_cat " +
                    "INNER JOIN paciente ON paciente.correo = partidas.idP " +
                    "WHERE id_categoria = ? AND MONTH(fechaInicio) = ? " +
                    "AND deterioro = (SELECT deterioro FROM paciente WHERE correo = ?)" +
                    "GROUP BY WEEK(fechaInicio, 3)" +
                ") AS avg_tasa ON WEEK(partidas.fechaInicio, 3) = avg_tasa.semana " +
                "WHERE idP = ? AND id_categoria = ? AND MONTH(fechaInicio) = ? " +
                "GROUP BY WEEK(fechaInicio, 3);"
                
               connection.query(sql, [datos.categoria, datos.fecha, datos.usuario,  datos.usuario,datos.categoria, datos.fecha], function (err, resultado) {
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
    //Lee el progreso de un paciente en un juego en comparacion con el resto de pacientes del mismo grado de deterioro
    progresoJuego(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT DAY(partidas.fechaInicio) AS dia, "+
                    "AVG(CASE WHEN paciente.correo = ? THEN partidas.aciertos / NULLIF(partidas.aciertos + partidas.fallos, 0) END) AS tasaAciertos_jugador,"+
                   " AVG(partidas.aciertos / NULLIF(partidas.aciertos + partidas.fallos, 0)) AS tasaAciertos_media_deterioro "+
                "FROM partidas INNER JOIN juegos ON partidas.idJ = juegos.id "+
                "INNER JOIN paciente ON partidas.idP = paciente.correo WHERE juegos.id = ? AND MONTH(partidas.fechaInicio) = ? "+
                    "AND paciente.deterioro = (SELECT deterioro FROM paciente WHERE correo = ?) GROUP BY DATE(partidas.fechaInicio);"  //agrupamos por dia, sin tener en cuenta la hora
                
               connection.query(sql, [datos.usuario, datos.juego,datos.fecha, datos.usuario], function (err, resultado) {
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
    //Lee el progreso total de un paciente
    progresoTotal(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = `SELECT MONTHNAME(partidas.fechaInicio) AS mes, AVG(CASE WHEN paciente.correo = ? THEN partidas.aciertos / NULLIF (
            partidas.aciertos + partidas.fallos,0) END) AS tasaAciertos_jugador,AVG(partidas.aciertos / NULLIF(partidas.aciertos + partidas.fallos,0)
    ) AS tasaAciertos_media_deterioro FROM partidas INNER JOIN juegos ON partidas.idJ = juegos.id INNER JOIN paciente ON partidas.idP = paciente.correo WHERE 
    juegos.id = ? AND paciente.deterioro = (SELECT  deterioro FROM paciente WHERE correo = ?) GROUP BY MONTH(partidas.fechaInicio);`;
               connection.query(sql, [datos.usuario, datos.juego,datos.usuario], function (err, resultado) {
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
    //Elimina una tarea de la planificacion de un paciente
    borrarTarea(id, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "delete from calendario where idTarea = ? ";
                connection.query(sql, [id], function (err, resultado) {
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

    //Asigna una tarea a un paciente 
    asignarTarea(data, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "insert into calendario (idT,idP,idJ,seRepite,nivel,fecha) values (?,?,?,?,?,?)";
                connection.query(sql, [data.terapeuta, data.usuario, data.juego, data.seRepite,data.nivel,data.fecha], function (err, resultado) {
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
}


module.exports = DAOTareas
