
class DAOComentarios{

    constructor(pool) {
        this.pool = pool
    }

    //Leer todos los comentarios asignados a un paciente
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

    //Publicar un comentario, la fecha es automaticamente la actual
    publicar(datos, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sql = "insert into comentarios (idT,idP,comentario,fecha) values (?,?,?,?)";
                connection.query(sql, [datos.terapeuta, datos.usuario, datos.comentario,new Date()], function (err, resultado) {
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
