$(function () {

    /*

    SUSTITUIR POR UN BOTON JUGAR PLANIFICACION SI NO HAY PONER TOAST

    let plan
    $.ajax({ // veo para cada dia que actividades hay
        method: "GET",
        url: "/tareas/tareaPlan",
        data: {
            dia: moment().format("YYYY-MM-DD")
        },
        success: function (datos, state, jqXHR) {

            if (datos.length == 0) {
                $("#textoElige").removeClass("d-none")
                $("#btnJugarPlan").addClass("d-none")
                plan = []
            } else if (datos.length > 0) {
                plan = datos
                $("#btnJugarPlan").removeClass("d-none")
                $("#textoElige").addClass("d-none")
            }
        },
        error: function (jqXHR, statusText, errorThrown) {
            nuevoToast("Ha ocurrido un error")
        }
    });*/

    $("#btnCrearNuevaCuenta").on("click", function (event) {
        event.preventDefault()
        $("#crearCuenta input").css("border-color", "")
        $("#alertaCrearCuenta").removeClass("d-none")
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

        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (correo.trim() == "" || !regex.test(correo)) {
            $("#alertaCrearCuenta").text("El correo introducido no es válido")
            $("#correo").css("border-color", "red");
        } else if (contraseña1.trim() == "" || contraseña2.trim() == "" || contraseña1 != contraseña2) {
            $("#alertaCrearCuenta").text("La contraseñas deben coincidir")
            $("#contraseña").css("border-color", "red");
            $("#contraseñaRep").css("border-color", "red");
        }
        else if (clinica.trim() == "") {
            $("#alertaCrearCuenta").text("La clínica introducida no es válida")
            $("#inputAdicional").css("border-color", "red");
        }
        else if (nombre.trim() == "") {
            $("#alertaCrearCuenta").text("El nombre introducido no es válido")
            $("#nombre").css("border-color", "red");
        }
        else if (apellidos.trim() == "") {
            $("#alertaCrearCuenta").text("Los apellidos introducidos no son válidos")
            $("#apellido").css("border-color", "red");
        } else {
            $.ajax({ // veo para cada dia que actividades hay
                method: "POST",
                url: "/user/crearCuenta",
                data: datos,
                success: function (datos, state, jqXHR) {

                    if (datos == 0) {
                        $("#alertaCrearCuenta").text("El correo ya está registrado")
                        $("#correo").css("border-color", "red");
                    } else {
                        $("#crearCuenta").modal("hide")
                        $("#crearCuenta input").css("border-color", "")
                        $("#alertaCrearCuenta").addClass("d-none")
                        $("#correo, #contraseña, #contraseñaRep, #inputAdicional, #nombre, #apellido").val("");
                        $("#InicioSesion").modal("show")
                    }
                },
                error: function (jqXHR, statusText, errorThrown) {
                    $("#alertaCrearCuenta").text("El correo introducido no es válido")
                    $("#correo").css("border-color", "red");
                }
            });
        }


    })

    $("#btnIniciarSesion").on("click", function (event) {

        event.preventDefault()

        $("#inicioSesion input").css("border-color", "")
        $("#alertaInicio").removeClass("d-none")

        var correo = $("#correoInicio").prop("value")
        var contraseña = $("#contraseñaInicio").prop("value")

        var datos = {
            correo: correo,
            contraseña: contraseña,
        }

        var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (correo.trim() == "" || !regex.test(correo)) {
            $("#alertaInicio").text("El correo introducido no es válido")
            $("#correoInicio").css("border-color", "red");
        } else if (contraseña.trim() == "") {
            $("#alertaInicio").text("La contraseña introducida no es válida")
            $("#contraseñaInicio").css("border-color", "red");
        } else {
            $.ajax({ // veo para cada dia que actividades hay
                method: "GET",
                url: "/user/login",
                data: datos,
                success: function (datos, state, jqXHR) {
                    if (datos == 0) {
                        $("#alertaInicio").text("Correo o contraseña no válidos")
                    }else if(datos == 1){
                        window.location.href = "/"
                    }else if(datoss = 2){
                        window.location.href = "/admin"
                    }
                },
                error: function (jqXHR, statusText, errorThrown) {
                    $("#alertaInicio").text("Correo o contraseña no válidos")
                }
            });
        }


    })

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