
class DAOComentarios{

    constructor(pool) {
        this.pool = pool
    }

    leerPorUsuario(usuario, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) { 
                callback(err, null);
            } else {
                const sql = "SELECT * from comentarios where idP = ? order by fecha asc";
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

    publicar(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "insert into comentarios (idT,idP,comentario) values (?,?,?)";
                connection.query(sql, [datos.terapeuta, datos.usuario, datos.comentario], function (err, resultado) {
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


module.exports = DAOComentarios
