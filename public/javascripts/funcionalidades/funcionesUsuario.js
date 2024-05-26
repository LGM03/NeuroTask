

$(function () {
    //Boton para crear una nueva cuenta 
    $("#btnCrearNuevaCuenta").on("click", function (event) {
        event.preventDefault()
        $("#crearCuenta input").css("border-color", "")
        
        var correo = $("#correo").prop("value")
        var contraseña1 = $("#contraseña").prop("value")
        var contraseña2 = $("#contraseñaRep").prop("value")
        var clinica = $("#inputAdicional").prop("value")
        var nombre = $("#nombre").prop("value")
        var apellidos = $("#apellido").prop("value")

        var datos = {
            nombre: nombre,
            apellido: apellidos,
            correo: correo,
            contraseña: contraseña1,
            clinica: clinica
        }

        //Compruebo la validez de los datos antes de hacer solicitudes al servidor
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (correo.trim() == "" || !regex.test(correo)) {
            $("#alertaCrearCuenta").removeClass("d-none")
            $("#alertaCrearCuenta").text("El correo introducido no es válido")
            $("#correo").css("border-color", "red");
        } else if (contraseña1.trim() == "" || contraseña2.trim() == "" || contraseña1 != contraseña2) {
            $("#alertaCrearCuenta").removeClass("d-none")
            $("#alertaCrearCuenta").text("La contraseñas deben coincidir")
            $("#contraseña").css("border-color", "red");
            $("#contraseñaRep").css("border-color", "red");
        }
        else if (clinica.trim() == "") {
            $("#alertaCrearCuenta").removeClass("d-none")
            $("#alertaCrearCuenta").text("La clínica introducida no es válida")
            $("#inputAdicional").css("border-color", "red");
        }
        else if (nombre.trim() == "") {
            $("#alertaCrearCuenta").removeClass("d-none")
            $("#alertaCrearCuenta").text("El nombre introducido no es válido")
            $("#nombre").css("border-color", "red");
        }
        else if (apellidos.trim() == "") {
            $("#alertaCrearCuenta").removeClass("d-none")
            $("#alertaCrearCuenta").text("Los apellidos introducidos no son válidos")
            $("#apellido").css("border-color", "red");
        } else {
            $.ajax({ // Creo una nueva cuenta 
                method: "POST",
                url: "/user/crearCuenta",
                data: datos,
                success: function (datos, state, jqXHR) {

                    if (datos == 0) { //Si el resultado es 0 es que el correo esta repetido
                        $("#alertaCrearCuenta").removeClass("d-none")
                        $("#alertaCrearCuenta").text("El correo ya está registrado")
                        $("#correo").css("border-color", "red");
                    } else { //Si todo va bien escondo el modal de registro y muestro el modal de inicio de sesion
                        $("#crearCuenta").modal("hide")
                        $("#crearCuenta input").css("border-color", "")
                        $("#alertaCrearCuenta").addClass("d-none")
                        $("#correo, #contraseña, #contraseñaRep, #inputAdicional, #nombre, #apellido").val("");
                        $("#InicioSesion").modal("show")
                    }
                },
                error: function (jqXHR, statusText, errorThrown) { //Si ha ocurrido un error lo indico
                    $("#alertaCrearCuenta").removeClass("d-none")
                    $("#alertaCrearCuenta").text("El correo introducido no es válido")
                    $("#correo").css("border-color", "red");
                }
            });
        }
    })

    //logica del modal para crear paciente. Solo un terapeuta podra crear el paciente
    $("#modalCrearPaciente").on("click", function (event) {
        event.preventDefault()
        $("#crearPaciente input").css("border-color", "")
        
        var correo = $("#correoPaciente").prop("value")
        var contraseña1 = $("#contraseñaPacienteRep").prop("value")
        var contraseña2 = $("#contraseñaPaciente").prop("value")
        var edad = $("#edadPaciente").prop("value")
        var nombre = $("#nombrePaciente").prop("value")
        var apellidos = $("#apellidoPaciente").prop("value")
        var deterioro = $("#deterioroPaciente").prop("value")

        var datos = {
            nombrePaciente: nombre,
            apellidoPaciente: apellidos,
            correoPaciente: correo,
            contraseñaPaciente: contraseña1,
            edadPaciente: edad,
            deterioroPaciente : deterioro
        }
        //Compruebo en cliente que los valores de inicio de sesion esten correctos
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (correo.trim() == "" || !regex.test(correo)) {
            $("#alertaCrearPaciente").removeClass("d-none")
            $("#alertaCrearPaciente").text("El correo introducido no es válido")
            $("#correoPaciente").css("border-color", "red");
        } else if (contraseña1.trim() == "" || contraseña2.trim() == "" || contraseña1 != contraseña2) {
            $("#alertaCrearPaciente").removeClass("d-none")
            $("#alertaCrearPaciente").text("La contraseñas deben coincidir")
            $("#contraseñaPacienteRep").css("border-color", "red");
            $("#contraseñaPaciente").css("border-color", "red");
        }
        else if (edad.trim() == "") {
            $("#alertaCrearPaciente").removeClass("d-none")
            $("#alertaCrearPaciente").text("La edad introducida no es válida")
            $("#edadPaciente").css("border-color", "red");
        }
        else if (nombre.trim() == "") {
            $("#alertaCrearPaciente").removeClass("d-none")
            $("#alertaCrearPaciente").text("El nombre introducido no es válido")
            $("#nombrePaciente").css("border-color", "red");
        }
        else if (apellidos.trim() == "") {
            $("#alertaCrearPaciente").removeClass("d-none")
            $("#alertaCrearPaciente").text("Los apellidos introducidos no son válidos")
            $("#apellidoPaciente").css("border-color", "red");
        } else {
            $.ajax({ //doy de alta el paciente si todos los parametros son correctos
                method: "POST",
                url: "/user/crearPaciente",
                data: datos,
                success: function (datos, state, jqXHR) {

                    if (datos == 0) { //Si el resultado es 0 es que el correo esta repetido
                        $("#alertaCrearPaciente").removeClass("d-none")
                        $("#alertaCrearPaciente").text("El correo ya está registrado")
                        $("#correoPaciente").css("border-color", "red");
                    } else { //Si esta todo correcto escondo el modal y muestro un toast de correcto 
                        $("#crearPaciente").modal("hide")
                        $("#crearPaciente input").css("border-color", "")
                        $("#alertaCrearPaciente").addClass("d-none")
                        $("#correoPaciente, #contraseñaPaciente, #contraseñaPacienteRep, #edadPaciente, #nombrePaciente, #apellidoPaciente").val("");
                        nuevoToast("Paciente creado con éxito")
                    }
                },
                error: function (jqXHR, statusText, errorThrown) { //Si ocurre un error, lo indico
                    $("#alertaCrearPaciente").removeClass("d-none")
                    $("#alertaCrearPaciente").text("El correo introducido no es válido")
                    $("#correoPaciente").css("border-color", "red");
                }
            });
        }
    })

    $("#btnIniciarSesion").on("click", function (event) {
        event.preventDefault()
        $("#inicioSesion input").css("border-color", "")
        
        var correo = $("#correoInicio").prop("value")
        var contraseña = $("#contraseñaInicio").prop("value")

        var datos = {
            correo: correo,
            contraseña: contraseña,
        }
        //Compruebo que los valores para iniciar sesion sean los apropiados
        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (correo.trim() == "" || !regex.test(correo)) {
            $("#alertaInicio").removeClass("d-none")
            $("#alertaInicio").text("El correo introducido no es válido")
            $("#correoInicio").css("border-color", "red");
        } else if (contraseña.trim() == "") {
            $("#alertaInicio").removeClass("d-none")
            $("#alertaInicio").text("La contraseña introducida no es válida")
            $("#contraseñaInicio").css("border-color", "red");
        } else {
            $.ajax({ //Leo en la base de datos los datos del login
                method: "GET",
                url: "/user/login",
                data: datos,
                success: function (datos, state, jqXHR) {
                    if (datos == 0) {//Si retorno 0 el correo no es valido 
                        $("#alertaInicio").removeClass("d-none")
                        $("#alertaInicio").text("Correo o contraseña no válidos")
                    } else if (datos == 1) { //Si es 1 es un paciente, derivo a la pagina de inicio 
                        window.location.href = "/"
                    } else if (datoss = 2) { //Si es 2 es un terapeuta, derivo a la pagina de admin
                        window.location.href = "/admin"
                    }
                },
                error: function (jqXHR, statusText, errorThrown) { //Si ocurre un error lo indico con un toast 
                    $("#alertaInicio").removeClass("d-none")
                    $("#alertaInicio").text("Correo o contraseña no válidos")
                }
            });
        }
    })
    //Cuando se esconda el modal, pongo todos los colores en su estados originales
    $('#InicioSesion').on('hidden.bs.modal', function () {
        $("#alertaInicio").addClass("d-none")
        $("#InicioSesion input").css("border-color", "");
        $("#InicioSesion input").prop("value", "");
    });

    $('#InicioSesion').on('hidden.bs.modal', function () {
        $("#alertaCrearCuenta").addClass("d-none")
        $("#crearCuenta input").css("border-color", "")
        $("#crearCuenta input").prop("value", "");
    });

})

function nuevoToast(text) {
    Toastify({
        text: text,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "#FFFFFF",
            color: "#fe8ee5"
        }
    }).showToast();
}