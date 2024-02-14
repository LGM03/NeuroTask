
class DAOTareas{

    constructor(pool) {
        this.pool = pool
    }
 
    tareaUsuarioDia(datos,callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT categoria, hecho, nombre, idTarea from calendario inner join juegos on idJ = juegos.id where idP = ? and fecha = ?";
                connection.query(sql,[datos.usuario, datos.dia], function (err, resultado) {
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

    historialUsuario(usuario,callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "SELECT categoria, nombre, fechaInicio, aciertos, fallos,duracion from juegos inner join partidas on idJ = juegos.id where idP = ? order by fechaInicio";
                connection.query(sql,[usuario], function (err, resultado) {
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

    borrarTarea(id,callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.log(`Error al obtener la conexión: ${err.message}`);
                callback(err, null);
            } else {
                const sql = "delete from calendario where idTarea = ? ";
                connection.query(sql,[id], function (err, resultado) {
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
