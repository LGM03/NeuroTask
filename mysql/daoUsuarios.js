
class DAOUsuario {   //DAO que accede a los destinos y su respectiva información

    constructor(pool) { //Constructor guarda pool en un atributo propio
        this.pool = pool
    }

    leerPorID(correo, callback) { //Busco al usuario que inicia sesion
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);
            } else {
                console.log(correo + " AASD")
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


    altaUsuario(datosUsuario, callback) {  //Creo un usuario nuevo, si se crea bien retorna 1, sino, null
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
                        var sql2 = "INSERT INTO `terapeuta` (correo,clinica)  VALUES (?,?);";

                        connection.query(sql2, [datosUsuario.correo, datosUsuario.clinica], function (err, resultado2) {
                            connection.release();
                            if (err) {
                                callback(err, null); //Si ocurre algun error retornamos el error
                            } else {
                                callback(null, "1")
                            }
                        })
                    }
                });
            }
        });
    }

    vincularPaciente(datosUsuario, callback) {  //Creo un usuario nuevo, si se crea bien retorna 1, sino, null
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);  //Si ocurre algun error retornamos el error
            } else {
                const sql = "INSERT INTO `pac_ter`(correoT, correoP) VALUES (?,?);";
                connection.query(sql, [datosUsuario.correoTer, datosUsuario.correo], function (err, resultado) {
                    if (err) {
                        callback(err, null); //Si ocurre algun error retornamos el error
                    } else {
                        callback(null, "1")
                    }
                });
            }
        });
    }


    altaPaciente(datosUsuario, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, null);
                return;
            }
    
            connection.beginTransaction(async (err) => {
                if (err) {
                    connection.release();
                    callback(err, null);
                    return;
                }
    
                try {
                    await insertarUsuario(connection, datosUsuario);
                    await insertarPaciente(connection, datosUsuario);
                    await conexionPacienteTerapeuta(connection, datosUsuario);
    
                    connection.commit((err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(err, null);
                            });
                        }
                        connection.release();
                        callback(null, "1"); // Todas las operaciones se completaron correctamente
                    });
                } catch (err) {
                    connection.rollback(() => {
                        connection.release();
                        callback(err, "0"); // Alguna operación falló
                    });
                }
            });
        });
    }
    
    async  insertarUsuario(connection, datosUsuario) {
        const sql = "INSERT INTO `usuario`(correo, nombre, apellido, contraseña, salt) VALUES (?,?,?,?,?);";
        await executeQuery(connection, sql, [datosUsuario.correo, datosUsuario.nombre, datosUsuario.apellido, datosUsuario.contrasenaPaciente, datosUsuario.salt]);
    }
    
    async  insertarPaciente(connection, datosUsuario) {
        const sql = "INSERT INTO `paciente` (correo,edad,deterioro)  VALUES (?,?,?);";
        await executeQuery(connection, sql, [datosUsuario.correo, datosUsuario.edad, datosUsuario.deterioro]);
    }
    
    async  conexionPacienteTerapeuta(connection, datosUsuario) {
        const sql = "INSERT INTO `pac_ter` (correoP,correoT)  VALUES (?,?);";
        await executeQuery(connection, sql, [datosUsuario.correo, datosUsuario.correoTer]);
    }
    
    async executeQuery(connection, sql, values) {
        return new Promise((resolve, reject) => {
            connection.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    


    pacientesXTerapeuta(correoTer, callback) {  //Creo un usuario nuevo, si se crea bien retorna 1, sino, null
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(err, null);  //Si ocurre algun error retornamos el error
            } else {
                const sql = "select nombre, apellido, edad ,pac_ter.correoP from pac_ter inner join usuario on pac_ter.correoP= usuario.correo " +
                    "inner join paciente on paciente.correo = pac_ter.correoP where pac_ter.correoT = ?";
                connection.query(sql, [correoTer], function (err, resultado) {
                    connection.release();
                    if (err) {
                        console.log(err)
                        callback(err, {}); //Si ocurre algun error retornamos el error
                    } else {
                        callback(null, resultado)
                    }
                });
            }
        });
    }


}


module.exports = DAOUsuario
