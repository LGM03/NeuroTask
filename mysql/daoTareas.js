
class DAOTareas{

    constructor(pool) {
        this.pool = pool
    }
 
    tareaUsuarioDia(datos,callback) {
        console.log("DAo "+ datos)
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.log(`Error al obtener la conexión: ${err.message}`);
                callback(err, null);
            } else {
                const sql = "SELECT categoria, hecho, nombre from calendario inner join juegos on idJ = juegos.id where idP = ? and fecha = ?";
                connection.query(sql,[datos.usuario, datos.dia], function (err, resultado) {
                    connection.release();
                    if (err) {
                        console.log(err)
                        console.log(`Error en la consulta a la base de datos: ${err.message}`);
                        callback(err, null);
                    } else {
                        console.log(resultado[0])
                        callback(null, resultado);
                    }
                });
            }
        });
    }   
    
}


module.exports = DAOTareas
