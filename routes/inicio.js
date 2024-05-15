var express = require('express');
var router = express.Router();
const pool = require('./bd')

//Inicio de sesion
router.post('/', (req, res) => {
    
    datosInicio = {
        correo: req.body.correo,
        contraseña : req.body.contraseña
    }

    //Compruebo que se han introducido todos los datos necesarios 
    if (!esValido(datosInicio)) {
        res.redirect(`/?error=${'Datos de usuario no validos'}`);
        return;
    }

    const DAOAp = require("../mysql/daoUsuarios")
    const midao = new DAOAp(pool)

    //Busco el usuario en la bd, si no esta aviso
    midao.leerUsuario(datosInicio, (err, datos) => {
        if (err) {
    
            res.redirect(`/?error=${"El usuario no existe"}`); 
        }
        else {
            res.redirect(`/admin`);
        }
    });

});

function esValido(datos) {  //valida la sintaxis del correo
    const correoComprobar = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return correoComprobar.test(datos.correo)
}



module.exports = router;
