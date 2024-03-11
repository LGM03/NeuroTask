var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();
const pool = require('./bd')

//Cuando se mande un formulario de reserva 

router.get("/login", async (req, res) => {
    try {
        const DAOAp = require("../mysql/daoUsuarios")
        const midao = new DAOAp(pool)
        var correo = req.query.correo
        var contraseña = req.query.contraseña

        midao.leerPorID(correo, async (err, datos) => {
            if (err) {
                res.json(0) //Cargo una ventana de error y ha ocurrido un problema
            }
            else {
                if (datos != null) {
                    const coincide = await bcrypt.compare(contraseña, datos.contraseña)
                    if (coincide) {
                        req.session.usuario = {
                            nombre: datos.nombre,
                            correo: correo
                        };
                        if (datos.edad) {
                            req.session.usuario.tipo = "paciente"
                            req.session.usuario.edad = datos.edad
                            res.json('1');
                        } else {
                            req.session.usuario.tipo = "terapeuta"
                            req.session.usuario.clinica = datos.clinica
                            res.json('2')
                        }
                    } else {
                        res.status(400)
                        res.json(0)
                    }
                }else{
                    res.status(400)
                    res.json(0)
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

    var datosUsuario = { //Recojo la información que viene del forms
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        correo: req.body.correo,
        contraseña: req.body.contraseña,
        clinica: req.body.clinica
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
                    res.status(400)
                    res.json(0); //Si ha ocurrido un error, recargo la ventana con mensaje de fallo
                }
                else {
                    res.json(datos)
                }
            });

        });
    });
});


router.post('/crearPaciente', (req, res) => {

    datosUsuario = { //Recojo la información que viene del forms
        nombre: req.body.nombrePaciente,
        apellido: req.body.apellidoPaciente,
        correo: req.body.correoPaciente,
        edad: req.body.edadPaciente,
        correoTer: req.session.usuario.correo, //Paso tambien el correo del terapeuta que esta creando el usuario
        deterioro: req.body.deterioroPaciente
    }

    const DAOAp = require("../mysql/daoUsuarios")
    const midao = new DAOAp(pool)
    const saltRounds = 10; // Número de rondas para el proceso de hashing (mayor es más seguro, pero más lento)

    bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(req.body.contraseñaPaciente, salt, (err, hash) => {
            // Almacena el 'hash' y el 'salt' en la base de datos
            datosUsuario.contrasenaPaciente = hash;
            datosUsuario.salt = salt;

            midao.altaPaciente(datosUsuario, (err, datos) => { //Guardamos en la base de datos la información de la reserva
                if (err) {
                    res.redirect(`/admin?error=${"Ya existe una cuenta con esos datos"}`); //Si ha ocurrido un error, recargo la ventana con mensaje de fallo
                }
                else {
                    res.redirect(`/admin?exito=${'Cuenta creada con éxito'}`); //Si todo ha ido bien redirijo a /destino con el mensaje de exito
                }
            });

        });
    });


});


router.post('/vincularPaciente', (req, res) => {

    datosUsuario = { //Recojo la información que viene del forms
        correo: req.body.correoVincular,
        correoTer: req.session.usuario.correo //Paso tambien el correo del terapeuta que esta creando el usuario
    }

    const DAOAp = require("../mysql/daoUsuarios")
    const midao = new DAOAp(pool)


    midao.vincularPaciente(datosUsuario, (err, datos) => { //Guardamos en la base de datos la información de la reserva
        if (err) {
            res.redirect(`/admin?error=${"No se pudo vincular al paciente"}`); //Si ha ocurrido un error, recargo la ventana con mensaje de fallo
        }
        else {
            res.redirect(`/admin?exito=${'Paciente vinculado con éxito'}`); //Si todo ha ido bien redirijo a /destino con el mensaje de exito
        }
    });

});

module.exports = router;