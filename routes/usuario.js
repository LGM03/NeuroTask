var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();

const mysql = require("mysql")
const pool = mysql.createPool({
    host: "localhost",
    user: "admin_aw",
    password: "",
    database: "neurotask"
})

//Cuando se mande un formulario de reserva 

router.post("/login", async (req, res) => {
    try {
        const DAOAp = require("../mysql/daoUsuarios")
        const midao = new DAOAp(pool)
        var correo = req.body.correo
        var contraseña = req.body.contraseña

        midao.leerPorID(correo, async (err, datos) => { //Aqui habria que pasarle la contraseña 
            if (err || datos == null) {
                res.redirect(`/?error=${"No se ha podido iniciar sesion"}`) //Cargo una ventana de error y ha ocurrido un problema
            }
            else {
                const coincide = await bcrypt.compare(contraseña, datos.contraseña)
                console.log("HOLA"+datos.edad + "  " + datos.clinica)
                if (coincide) {
                    req.session.usuario = {
                        nombre: datos.nombre,
                        correo: correo
                    };
                    if(datos.edad){
                        req.session.usuario.tipo = "paciente"
                        req.session.usuario.edad = datos.edad
                    }else{
                        req.session.usuario.tipo = "terapeuta"
                        req.session.usuario.clinica = datos.clinica
                    }
                    res.redirect('/');
                } else {
                    res.redirect(`/?error=${"Credenciales no validas"}`)
                }
            }
        });
    } catch {
        res.render('error', { error: 'Ha ocurrido un error' });
    }


})

router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
})


router.post('/crearCuenta', (req, res) => {

    datosUsuario = { //Recojo la información que viene del forms
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo,
        contraseña: req.body.contraseña,
        tipo: req.body.tipo
    }

    if (req.body.tipo === "1") {
        datosUsuario.edad = req.body.edad
    } else {
        datosUsuario.clinica = req.body.clinica
    }
    const DAOAp = require("../mysql/daoUsuarios")
    const midao = new DAOAp(pool)
    const saltRounds = 10; // Número de rondas para el proceso de hashing (mayor es más seguro, pero más lento)

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(datosUsuario.contraseña, salt, (err, hash) => {
            // Almacena el 'hash' y el 'salt' en la base de datos
            datosUsuario.contraseña = hash;
            datosUsuario.salt = salt;

            midao.altaUsuario(datosUsuario, (err, datos) => { //Guardamos en la base de datos la información de la reserva
                if (err) {
                    res.redirect(`/?error=${"Ya existe una cuenta con esos datos"}`); //Si ha ocurrido un error, recargo la ventana con mensaje de fallo
                }
                else {
                    res.redirect(`/?exito=${'Cuenta creada con éxito'}`); //Si todo ha ido bien redirijo a /destino con el mensaje de exito
                }
            });

        });
    });


});

module.exports = router;