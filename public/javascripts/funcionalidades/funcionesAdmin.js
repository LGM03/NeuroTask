
$(function () {

    //Preparo el modal de las tareas
    $.ajax({
        url: "/admin/leerJuegos",
        method: "GET",
        success: function (datos, b, c) {

            if (datos.length == 0) {
                nuevoToast("No hay juegos disponibles para asignar")
            } else {
                datos.forEach((elem) => {
                    $("#selectJuego").append($('<option>', {
                        value: elem.id,
                        text: elem.nombre + " - "+ elem.categoria
                    }));
                })
                $("#selectJuego option[value='1']").prop("selected", true);
            }
        },
        error: function (a, b, c) {
            nuevoToast("No se pudo cargar el listado de juegos")
        }
    })

    //listo todos los pacientes de un terapeuta
    $("#listarPacientes").on("click", function (event) {
        $("#tituloUsuarios").text("Listado de Usuarios")
        $("#cuadranteCalendario").addClass("d-none")
        $("#cuadranteComentarios").addClass("d-none")
        $("#cuadranteHistorial").addClass("d-none")
        $("#cuadranteEstadisticas").addClass("d-none")
        $("#divListadoUsuarios").removeClass('d-none')
        $("#divListadoJuegos").addClass('d-none')
        $("#alertaListadoUsuarios").addClass('d-none')
        $("#divListadoUsuarios .cajaPaciente").remove()
        //Solicitud a la base de datos de los usuarios por paciente
        $.ajax({
            url: "/admin/listarUsuarios",
            method: "GET",
            success: function (datos, b, c) {

                if (datos.length == 0) {
                    $("#alertaListadoUsuarios").removeClass('d-none')
                } else {
                    datos.forEach(element => {
                        crearCajaPaciente(element);
                    });

                }
            },
            error: function (a, b, c) {
                $("#alertaListadoUsuarios").removeClass('d-none')
            }
        })
    })
    //listar todos juegos 
    $("#listarJuegos").on("click", function (event) {
        $("#divListadoUsuarios").addClass('d-none')
        $("#cuadranteCalendario").addClass("d-none")
        $("#cuadranteComentarios").addClass("d-none")
        $("#cuadranteHistorial").addClass("d-none")
        $("#cuadranteEstadisticas").addClass("d-none")
        $("#divListadoJuegos").removeClass('d-none')
        $("#alertaListadoJuegos").addClass('d-none')
        $("#divListadoJuegos .cajaJuego").remove()
        $.ajax({ //Solicitud de info de los juegos
            url: "/admin/leerJuegos",
            method: "GET",
            success: function (datos, b, c) {

                if (datos.length == 0) {
                    $("#alertaListadoJuegos").removeClass('d-none')
                } else {
                    datos.forEach(element => {
                        crearCajaJuego(element);
                    });
                }
            },
            error: function (a, b, c) {
                $("#alertaListadoJuegos").removeClass('d-none')
            }
        })
    })
    //Ver historial de juegos de un paciente 
    $(document).on("click", ".btnVerHistorial", function () {
        $("#bodyTablaHistorial").empty()
        var divContenedor = $(this).closest('.cajaPaciente');
        var usuario = divContenedor.data("correo")
        divContenedor.removeClass('cajaPaciente')
        $("#divListadoUsuarios .cajaPaciente").remove()
        divContenedor.addClass('cajaPaciente')
        $("#tituloUsuarios").text("Historial del usuario")
        $("#cuadranteCalendario").addClass("d-none")
        $("#cuadranteComentarios").addClass("d-none")
        $("#cuadranteEstadisticas").addClass("d-none")
        $("#cuadranteHistorial").removeClass("d-none")

        $.ajax({//Solicitud informacion del historial del paciente
            method: "GET",
            url: "/tareas/partidasUsuario",
            data: { usuario: usuario },
            success: function (datos, state, jqXHR) {
                if (datos.length != 0) { //Si hay datos disponibles para mostrar
                    datos.forEach(function (dato) {//actualizo dinamicamente la vista
                        const date = new Date(dato.fechaInicio);
                        const formattedDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
                        var fila = '<tr><td>' + dato.nombre + '</td><td>' + dato.categoria + '</td><td>' + dato.aciertos + '</td><td>' + dato.fallos + '</td><td>' + dato.duracion + '</td><td>' + dato.nivel + '</td><td>' + formattedDate + '</td></tr>';
                        $("#bodyTablaHistorial").append(fila);
                    });
                } else {
                    nuevoToast("No hay tareas en el histórico")
                }
            },
            error: function (jqXHR, statusText, errorThrown) {
                nuevoToast("Ha ocurrido un error con el historial")
            }
        });
    })
    //logica del modal para vincular un terapeuta con un paciente
    $("#modalVincular").on("click", function (event) {
        event.preventDefault()
        $("#alertaVincular").addClass("d-none")
        $("#vincularPaciente input").css("border-color", "")
        var correoPaciente = $("#correoVincular").prop("value")
        $.ajax({ //Actualizo la base de datos
            method: "POST",
            url: "/user/vincularPaciente",
            data: { correoPaciente: correoPaciente },
            success: function (datos, state, jqXHR) {

                if (datos == 1) {//Si todo ha ido bien escondo el modal y muestro un toast de correcto
                    $("#vincularPaciente").modal("hide")
                    $("#correoVincular").val("")
                    nuevoToast("Paciente vinculado con éxito")
                } else { //Si ha ocurrido un error en el modal lo indico
                    $("#alertaVincular").removeClass("d-none")
                    $("#alertaVincular").text("El correo introducido no es válido")
                    $("#correoVincular").css("border-color", "red");
                    nuevoToast("No se pudo vincular al paciente")
                }
            },
            error: function (jqXHR, statusText, errorThrown) { //En caso de error lo indico
                $("#alertaVincular").removeClass("d-none")
                $("#alertaVincular").text("El correo introducido no es válido")
                $("#correoVincular").css("border-color", "red");
                nuevoToast("No se pudo vincular al paciente")
            }
        });
    })
})
//Creo una caja para mostrar los pacientes de un terapeuta 
function crearCajaPaciente(element) {

    const caja = $('<div class="row bg-light rounded m-2 d-flex justify-content-around cajaPaciente" ></div>');

    const cajaInfo = $('<div class="col col-md-4 cajaInfo bg-light rounded m-2 d-flex flex-column"></div>');
    // Sección de info del paciente

    // Contenedor para el nombre y la fecha
    const infoContainer = $('<div class="text-start"></div>');
    const nombreCom = $('<h5 class="mb-0">' + element.nombre + ' ' + element.apellido + ', ' + element.edad + '</h5>')
    infoContainer.append(nombreCom)

    const tipoContainer = $('<div class = "text-start"></div>');
    const tipo = $('<p class="mb-0 correoPaciente"> ' + element.correoP + '</p>')
    tipoContainer.append(tipo)

    const deterioroContainer = $('<div class = "text-start"></div>');
    const deterioro = $('<p class="mb-0 correoPaciente"> <em>Deterioro: ' + element.deterioro + '</em></p>')
    deterioroContainer.append(deterioro)

    var botonURL = $('<button class="alert alert-secondary p-1 w-100 btnCopiarURL mt-1"> Copiar URL de inicio de sesión</button>')
    const cajaBotones = $('<div class="col col-md-3 bg-light rounded m-2 d-flex flex-column"></div>');

    var botonHistorial = $('<button class="alert alert-success p-1 w-100 btnVerHistorial"> Ver Historiales </button>')
    var botonEstadisticas = $('<button class="alert alert-warning p-1 w-100 btnVerEstadisticas"> Ver Estadísticas </button>')

    const cajaBotones2 = $('<div class="col col-md-3 bg-light rounded m-2 d-flex flex-column"></div>');
    var botonPlanificacion = $('<button class="alert alert-info p-1 w-100 btnVerPlanificacion"> Ver Planificación </button>')
    var botonComentarios = $('<button class="alert alert-secondary p-1 w-100 btnVerComentarios"> Ver Anotaciones </button>')

    cajaBotones.append(botonHistorial);
    cajaBotones.append(botonEstadisticas);


    cajaBotones2.append(botonPlanificacion);
    cajaBotones2.append(botonComentarios);

    cajaInfo.append(infoContainer);
    cajaInfo.append(tipoContainer);
    cajaInfo.append(deterioroContainer);
    cajaInfo.append(botonURL)

    caja.append(cajaInfo, cajaBotones, cajaBotones2)
    caja.data("correo", element.correoP)
    $("#divListadoUsuarios").append(caja);
}
//Creo una caja para mostrar los juegos disponibles y su informacion
function crearCajaJuego(element) {

    const caja = $('<div class="row bg-light rounded m-2 d-flex justify-content-around cajaJuego" ></div>');

    const imagen = $('<img src="' + element.imagen + '"alt="' + element.nombre + '" class = "mt-1 imagenListada">')
    const cajaInfo = $('<div class="col col-md-8 cajaInfo bg-light rounded m-2 d-flex flex-column"></div>');
    // Sección de info del paciente

    // Contenedor para el nombre y la fecha
    const infoContainer = $('<div class="text-start"></div>');
    const nombreCom = $('<h5 class="mb-0">' + element.id + ' :  ' + element.nombre + '</h5>')
    infoContainer.append(nombreCom)

    const tipoContainer = $('<div class = "text-start"></div>');
    const tipo = $('<p class="mb-0"> <em>Categoría: ' + element.categoria + '</em></p>')
    tipoContainer.append(tipo)

    const descripcionContainer = $('<div class = "text-start"></div>');
    const descripcion = $('<p class="mb-0"> ' + element.descripcion + '</p>')
    descripcionContainer.append(descripcion)

    cajaInfo.append(infoContainer, tipoContainer, descripcionContainer)

    caja.append(imagen, cajaInfo)

    $("#divListadoJuegos").append(caja);
}
//Toast para mostrar mensajes abajo a la derecha 
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