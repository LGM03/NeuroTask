$(function () {
    $("#listarPacientes").on("click", function (event) {
        
        $("#divListadoUsuarios").removeClass('d-none')
        $("#divListadoJuegos").addClass('d-none')
        $("#alertaListadoUsuarios").addClass('d-none')
        $("#divListadoUsuarios .cajaPaciente").remove()
        $.ajax({
            url: "/admin/listarUsuarios",
            method: "GET",
            success: function (datos, b, c) {
                console.log(datos)
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

    $("#listarJuegos").on("click", function (event) {
        $("#divListadoUsuarios").addClass('d-none')
        $("#divListadoJuegos").removeClass('d-none')
        $("#alertaListadoJuegos").addClass('d-none')
        $("#divListadoJuegos .cajaJuego").remove()
        $.ajax({
            url: "/admin/leerJuegos",
            method: "GET",
            success: function (datos, b, c) {
                console.log(datos)
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
})

function crearCajaPaciente(element) {

    const caja = $('<div class="row bg-light rounded m-2 d-flex justify-content-around cajaPaciente" ></div>');

    const cajaInfo = $('<div class="col col-md-4 cajaInfo bg-light rounded m-2 d-flex flex-column"></div>');
    // Sección de info de la reserva

    // Contenedor para el nombre y la fecha
    const infoContainer = $('<div class="text-start"></div>');
    const nombreCom = $('<h5 class="mb-0">' + element.nombre + ' '+ element.apellido +', '+ element.edad+'</h5>')
    infoContainer.append(nombreCom)

    const tipoContainer = $('<div class = "text-start"></div>');
    const tipo = $('<p class="mb-0" id = "correoPaciente"> ' + element.correoP + '</p>')
    tipoContainer.append(tipo)

    const cajaBotones = $('<div class="col col-md-3 bg-light rounded m-2 d-flex flex-column"></div>');

    var botonHistorial = $('<button class="alert alert-success p-1 w-100" id = "btnVerHistorial"> Ver Historiales </button>')
    var botonEstadisticas = $('<button class="alert alert-warning p-1 w-100" id = "btnVerEstadisticas"> Ver Estadísticas </button>')

    const cajaBotones2 = $('<div class="col col-md-3 bg-light rounded m-2 d-flex flex-column"></div>');
    var botonPlanificacion =  $('<button class="alert alert-info p-1 w-100" id = "btnVerPlanificacion"> Ver Planificación </button>')
    var botonComentarios =  $('<button class="alert alert-secondary p-1 w-100" id = "btnVerComentarios"> Ver Comentarios </button>')

    cajaBotones.append(botonHistorial);
    cajaBotones.append(botonEstadisticas);


    cajaBotones2.append(botonPlanificacion);
    cajaBotones2.append(botonComentarios);

    cajaInfo.append(infoContainer);
    cajaInfo.append(tipoContainer);

    caja.append(cajaInfo,cajaBotones,cajaBotones2)

    $("#divListadoUsuarios").append(caja);
}


function crearCajaJuego(element) {

    const caja = $('<div class="row bg-light rounded m-2 d-flex justify-content-around cajaJuego" ></div>');

    const imagen = $('<img src="'+element.imagen+'"alt="'+element.nombre+'" class = "mt-1 imagenListada">')
    const cajaInfo = $('<div class="col col-md-8 cajaInfo bg-light rounded m-2 d-flex flex-column"></div>');
    // Sección de info de la reserva

    // Contenedor para el nombre y la fecha
    const infoContainer = $('<div class="text-start"></div>');
    const nombreCom = $('<h5 class="mb-0">' + element.id + ' :  '+ element.nombre +'</h5>')
    infoContainer.append(nombreCom)

    const tipoContainer = $('<div class = "text-start"></div>');
    const tipo = $('<p class="mb-0"> ' + element.categoria + '</p>')
    tipoContainer.append(tipo)

    const descripcionContainer = $('<div class = "text-start"></div>');
    const descripcion = $('<p class="mb-0"> ' + element.descripcion + '</p>')
    descripcionContainer.append(descripcion)

    cajaInfo.append(infoContainer,tipoContainer,descripcionContainer)

    caja.append(imagen,cajaInfo)

    $("#divListadoJuegos").append(caja);
}