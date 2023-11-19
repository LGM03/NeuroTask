
class DAOUsuario {   //DAO que accede a los destinos y su respectiva información

    constructor(pool) { //Constructor guarda pool en un atributo propio
        this.pool = pool
    }

    leerPorID(correo, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                const sqlTerapeuta = "SELECT * FROM usuario INNER JOIN terapeuta ON usuario.correo = terapeuta.correo WHERE usuario.correo = ?";
                const sqlPaciente = "SELECT * FROM usuario INNER JOIN paciente ON usuario.correo = paciente.correo WHERE usuario.correo = ?";

                connection.query(sqlTerapeuta, [correo], function (err, resultado) {
                    if (err) {
                        connection.release();
                        callback(err, null);
                    } else if (resultado.length > 0) {
                        connection.release();
                        resultado[0].clinica = resultado[0].clinica;
                        callback(null, resultado[0]);
                    } else {
                        connection.query(sqlPaciente, [correo], function (err, resultado2) {
                            connection.release();
                            if (err || resultado2.length === 0) {
                                callback(err, null);
                            } else {
                                resultado2[0].edad = resultado2[0].edad;
                                callback(null, resultado2[0]);
                            }
                        });
                    }
                });
            }
        });
    }


    altaUsuario(datosUsuario, callback) {  //TODO podría hacer un rollback??
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);  //Si ocurre algun error retornamos el error
            } else {
                const sql = "INSERT INTO `usuario`(correo, nombre, apellido, contraseña, salt) VALUES (?,?,?,?,?);";
                connection.query(sql, [datosUsuario.correo, datosUsuario.nombre, datosUsuario.apellido, datosUsuario.contraseña, datosUsuario.salt], function (err, resultado) {
                    if (err) {
                        connection.release();
                        callback(err, null); //Si ocurre algun error retornamos el error
                    } else {
                        var sql2 = ""
                        if (datosUsuario.edad) {
                            sql2 = "INSERT INTO `paciente`(correo,edad) VALUES (?,?);"
                            var adicional = datosUsuario.edad
                        } else {
                            sql2 = "INSERT INTO `terapeuta` (correo,clinica)  VALUES (?,?);";
                            adicional = datosUsuario.clinica
                        }
                        connection.query(sql2, [datosUsuario.correo, adicional], function (err, resultado) {
                            if (err) {
                                connection.release();
                                callback(err, null); //Si ocurre algun error retornamos el error
                            } else {
                                if (datosUsuario.edad) {
                                    var sql3 = "CREATE TABLE `partidas_"+ datosUsuario.correo +
                                        "`(idJ INT, fechaInicio TIMESTAMP, aciertos INT, fallos INT, duracion INT,PRIMARY KEY (idJ, fechaInicio)," +
                                        "FOREIGN KEY (idJ) REFERENCES juegos(id))";
                                    connection.query(sql3, [], function (err, resultado) {
                                        if (err) {
                                            connection.release();
                                            callback(err, null); //Si ocurre algun error retornamos el error
                                        } else {
                                            callback(null, resultado); //Si todo va bien devolvemos la información 
                                        }
                                    });
                                }else {
                                    callback(null, resultado); //Si todo va bien devolvemos la información 
                                }

                            }
                        });
                    }
                });
            }
        });
    }

}


module.exports = DAOUsuario
