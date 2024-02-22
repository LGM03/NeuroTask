
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


    altaPaciente(datosUsuario, callback) {  //Creo un usuario nuevo, si se crea bien retorna 1, sino, null
        console.log(datosUsuario)


        const insertarUsuario = (datosUsuario) => {
            return new Promise((resolve, reject) => {
                this.pool.getConnection((err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        const sql = "INSERT INTO `usuario`(correo, nombre, apellido, contraseña, salt) VALUES (?,?,?,?,?);";
                        connection.query(sql, [datosUsuario.correo, datosUsuario.nombre, datosUsuario.apellido, datosUsuario.contrasenaPaciente, datosUsuario.salt], function (err, resultado) {
                            connection.release();
                            if (err) {
                                reject(err);
                            } else {
                                resolve(resultado);
                            }
                        });
                    }
                });
            });
        };

        const insertarPaciente = (datosUsuario) => {
            return new Promise((resolve, reject) => {
                this.pool.getConnection((err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        var sql2 = "INSERT INTO `paciente` (correo,edad)  VALUES (?,?);";
                        connection.query(sql2, [datosUsuario.correo, datosUsuario.edad], function (err, resultado2) {
                            connection.release();
                            if (err) {
                                reject(err);
                            } else {
                                resolve(resultado2);
                            }
                        });
                    }
                });
            });
        };

        const conexionPacienteTerapeuta = (datosUsuario) => {
            return new Promise((resolve, reject) => {
                this.pool.getConnection((err, connection) => {
                    if (err) {
                        reject(err);
                    } else {
                        var sql2 = "INSERT INTO `pac_ter` (correoP,correoT)  VALUES (?,?);";
                        connection.query(sql2, [datosUsuario.correo, datosUsuario.correoTer], function (err, resultado2) {
                            connection.release();
                            if (err) {
                                reject(err);
                            } else {
                                resolve(resultado2);
                            }
                        });
                    }
                });
            });
        };
        const executeQueries = async () => {
            try {
                await insertarUsuario(datosUsuario);

                await insertarPaciente(datosUsuario);

                await conexionPacienteTerapeuta(datosUsuario);

                callback(null,"1")
            } catch (err) {
                callback(err, "0");
            }
        }

        executeQueries()

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
