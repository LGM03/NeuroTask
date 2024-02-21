var express = require('express');
var router = express.Router();
const pool = require('./bd')

router.post('/', (req, res) => {
    
    datosInicio = {
        correo: req.body.correo,
        contraseña : req.body.contraseña
    }

    //Compruebo que se han introducido todos los datos necesarios 
    if (!esValido(datosInicio)) {
        console.log("fallo en validar")
        res.redirect(`/?error=${'Datos de usuario no validos'}`);
        return;
    }

    const DAOAp = require("../mysql/daoUsuarios")
    const midao = new DAOAp(pool)

    midao.leerUsuario(datosInicio, (err, datos) => {
        if (err) {
            console.log(err);  //Si hay un error tengo que poner un mensaje de alerta 
            console.log("FALLO")
            res.redirect(`/?error=${"El usuario no existe"}`); 
        }
        else {
            console.log("EXITO")
            res.redirect(`/admin`);
        }
    });

});

function esValido(datos) {  //valida la sintaxis del correo
    const correoComprobar = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return correoComprobar.test(datos.correo)
}



module.exports = router;
