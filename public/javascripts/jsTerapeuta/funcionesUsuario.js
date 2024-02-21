$(function () {

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
            } else {
                plan = datos
                $("#btnJugarPlan").removeClass("d-none")
                $("#textoElige").addClass("d-none")
            }
            console.log(plan)
        },
        error: function (jqXHR, statusText, errorThrown) {
            nuevoToast("Ha ocurrido un error con el calendario")

        }
    });

    $("#btnCrearNuevaCuenta").on("click", function (event) {

        event.preventDefault()
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

        $("#alertaCrearCuenta").removeClass("d-none")
        if (correo.trim() == "") {
            $("#alertaCrearCuenta").removeClass("d-none")
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
                    }
                },
                error: function (jqXHR, statusText, errorThrown) {
                    nuevoToast("Ha ocurrido un error con el calendario")

                }
            });
        }


    })

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