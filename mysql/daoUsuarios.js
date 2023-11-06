
class DAOUsuario{

    constructor(pool) {
        this.pool = pool
    }

    leerUsuario(datos,callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.log(`Error al obtener la conexión: ${err.message}`);
                callback(err, null);
            } else {
                const sql = "SELECT * from usuario where correo = ? and contraseña = ?";
                connection.query(sql,[datos.correo, datos.contraseña], function (err, resultado) {
                    connection.release();
                    if (err) {
                        console.log(`Error en la consulta a la base de datos: ${err.message}`);
                        callback(err, null);
                    } else {
                        callback(null, resultado[0].idU);
                    }
                });
            }
        });
    }   

    leerTodos(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.log(`Error al obtener la conexión: ${err.message}`);
                callback(err, null);
            } else {
                const sql = "SELECT nombre, apellido, imagen from usuario where idU in (select idP from paciente)";
                connection.query(sql,null, function (err, resultado) {
                    connection.release();
                    if (err) {
                        console.log(`Error en la consulta a la base de datos: ${err.message}`);
                        callback(err, null);
                    } else {
                        callback(null, resultado);
                    }
                });
            }
        });
    }   
    
}


module.exports = DAOUsuario
