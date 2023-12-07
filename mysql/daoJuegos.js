
class DAOJuegos{

    constructor(pool) {
        this.pool = pool
    }

    leerTodos(callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.log(`Error al obtener la conexión: ${err.message}`);
                callback(err, null);
            } else {
                const sql = "SELECT * from juegos";
                connection.query(sql, null, function (err, resultado) {
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
 
    leerPorID(id,callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                console.log(`Error al obtener la conexión: ${err.message}`);
                callback(err, null);
            } else {
                const sql = "SELECT * from juegos where id = ?";
                connection.query(sql,[id], function (err, resultado) {
                    connection.release();
                    if (err) {
                        console.log(`Error en la consulta a la base de datos: ${err.message}`);
                        callback(err, null);
                    } else {
                        callback(null, resultado[0]);
                    }
                });
            }
        });
    }   
    
    guardarPartida(datosJuego,callback){  //Almaceno la durancion en s, usar momento.js para humanizar 
        this.pool.getConnection(function(err,connection){
            if(err){
                callback(err,null)
            }else{
                const sql = "insert into `partidas_"+datosJuego.usuario+"` values(?,?,?,?,?)"
                const fechaSQL = new Date(datosJuego.fechaInicio).toISOString().slice(0, 19).replace("T", " ");
                connection.query(sql,[datosJuego.idJuego, fechaSQL, datosJuego.aciertos,datosJuego.fallos, datosJuego.duracion],function(err,resultado){
                    connection.release();
                    if(err){
                        callback(err,null)
                    }else{
                        callback(null, resultado)
                    }
                })
            }
        })
    }
}


module.exports = DAOJuegos
