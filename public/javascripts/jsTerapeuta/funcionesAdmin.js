$(function () {
    $("#listarPacientes").on("click", function (event) {
        $("#cuadranteCalendario").addClass("d-none")
        $("#divListadoUsuarios").removeClass('d-none')
        $("#divListadoJuegos").addClass('d-none')
        $("#alertaListadoUsuarios").addClass('d-none')
        $("#divListadoUsuarios .cajaPaciente").remove()
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

    $("#listarJuegos").on("click", function (event) {
        $("#divListadoUsuarios").addClass('d-none')
        $("#divListadoJuegos").removeClass('d-none')
        $("#alertaListadoJuegos").addClass('d-none')
        $("#divListadoJuegos .cajaJuego").remove()
        $.ajax({
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

    $(document).on("click", ".btnVerPlanificacion", function () {
        var divContenedor = $(this).closest('.cajaPaciente');
        var usuario = divContenedor.data("correo")
        divContenedor.removeClass('cajaPaciente')
        $("#divListadoUsuarios .cajaPaciente").remove()
        divContenedor.addClass('cajaPaciente')
        $("#tituloUsuarios").text("Información del usuario")

        $("#cuadranteCalendario").removeClass("d-none")

        //Logica de calendario a mes visto
        $('#calendario').fullCalendar({ //
            header: {
                left: 'prev,next today',  //opciones para moverse por las fechas del calendario
                center: 'title', //centramos el titulo
            },
            dayRender: function (date, cell) {
                var data = { //Paso a la consulta el usuario y dia en cuestion
                    usuario: usuario,
                    dia: date.format('YYYY-MM-DD')  // Utiliza date.format para obtener la fecha en el formato deseado
                };

                $.ajax({ // veo para cada dia que actividades hay
                    method: "GET",
                    url: "/tareas/tareaUsuarioDia",
                    data: data,
                    success: function (datos, state, jqXHR) {
                        console.log(datos.length)
                        if (datos.length == 0) {
                            cell.css("background-color", "rgba(159, 255, 162)");
                        } else {
                            cell.css("background-color", "rgba(255, 227, 144)");  //amarillo para dias con momentos libres                           
                        }
                    },
                    error: function (jqXHR, statusText, errorThrown) {
                        alert("Ha ocurrido un error con el calendario")
                    }
                });

            }, dayClick: function (date, jsEvent, view) {
                $(".tareaJugador").remove()
                var data = { //Paso a la consulta el usuario y dia en cuestion
                    usuario: usuario,
                    dia: date.format('YYYY-MM-DD')  // Utiliza date.format para obtener la fecha en el formato deseado
                };

                $.ajax({ // veo para cada dia que actividades hay
                    method: "GET",
                    url: "/tareas/tareaUsuarioDia",
                    data: data,
                    success: function (datos, state, jqXHR) {

                        $("#divTablaCalendario").removeClass("d-none")
                        $("#tituloTabla").text("Tareas asignadas el " + date.format('DD-MM-YYYY'))
                       
                        if (datos != undefined) {
                            datos.forEach(function (dato) {
                                console.log(dato.idTarea)
                                if (dato.hecho == 0) {
                                    var fila = '<tr class = "tareaJugador" data-idtarea="' + dato.idTarea + '"><td> <button class = "btn btn-danger btnEliminarTarea">X Eliminar</button> </td><td>' + dato.nombre + '</td><td>' + dato.categoria + '</td><td>' + "No" + '</td></tr>';
                                } else {
                                    var fila = '<tr class = "tareaJugador" data-idtarea="' + dato.idTarea + '"><td></td><td>' + dato.nombre + '</td><td>' + dato.categoria + '</td><td>' + "Si" + '</td></tr>';
                                }
                                $("#bodyTabla").append(fila);

                            });
                        }
                    },
                    error: function (jqXHR, statusText, errorThrown) {
                        alert("Ha ocurrido un error con el calendario")
                    }
                });

            }

        });

    })

    $(document).on("click", ".btnEliminarTarea", function (event) {

        var idTarea = $(this).closest('tr.tareaJugador').data("idtarea");
        var divTarea = $(this).closest('tr.tareaJugador')
        console.log(idTarea);
        var data = { id: idTarea };
        $.ajax({
            url: "/tareas/eliminar",
            method: "DELETE",
            data :data,
            success: function (datos, b, c) {

                if (datos == 0) {
                    alert("No se pudo eliminar la tarea")
                } else {
                    divTarea.slideUp(1000)
                }
            },
            error: function (a, b, c) {
                alert("No se pudo eliminar la tarea")
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
    const nombreCom = $('<h5 class="mb-0">' + element.nombre + ' ' + element.apellido + ', ' + element.edad + '</h5>')
    infoContainer.append(nombreCom)

    const tipoContainer = $('<div class = "text-start"></div>');
    const tipo = $('<p class="mb-0 correoPaciente"> ' + element.correoP + '</p>')
    tipoContainer.append(tipo)

    const cajaBotones = $('<div class="col col-md-3 bg-light rounded m-2 d-flex flex-column"></div>');

    var botonHistorial = $('<button class="alert alert-success p-1 w-100 btnVerHistorial"> Ver Historiales </button>')
    var botonEstadisticas = $('<button class="alert alert-warning p-1 w-100 btnVerEstadisticas"> Ver Estadísticas </button>')

    const cajaBotones2 = $('<div class="col col-md-3 bg-light rounded m-2 d-flex flex-column"></div>');
    var botonPlanificacion = $('<button class="alert alert-info p-1 w-100 btnVerPlanificacion"> Ver Planificación </button>')
    var botonComentarios = $('<button class="alert alert-secondary p-1 w-100 btnVerComentarios"> Ver Comentarios </button>')

    cajaBotones.append(botonHistorial);
    cajaBotones.append(botonEstadisticas);


    cajaBotones2.append(botonPlanificacion);
    cajaBotones2.append(botonComentarios);

    cajaInfo.append(infoContainer);
    cajaInfo.append(tipoContainer);

    caja.append(cajaInfo, cajaBotones, cajaBotones2)
    caja.data("correo", element.correoP)
    $("#divListadoUsuarios").append(caja);
}


function crearCajaJuego(element) {

    const caja = $('<div class="row bg-light rounded m-2 d-flex justify-content-around cajaJuego" ></div>');

    const imagen = $('<img src="' + element.imagen + '"alt="' + element.nombre + '" class = "mt-1 imagenListada">')
    const cajaInfo = $('<div class="col col-md-8 cajaInfo bg-light rounded m-2 d-flex flex-column"></div>');
    // Sección de info de la reserva

    // Contenedor para el nombre y la fecha
    const infoContainer = $('<div class="text-start"></div>');
    const nombreCom = $('<h5 class="mb-0">' + element.id + ' :  ' + element.nombre + '</h5>')
    infoContainer.append(nombreCom)

    const tipoContainer = $('<div class = "text-start"></div>');
    const tipo = $('<p class="mb-0"> ' + element.categoria + '</p>')
    tipoContainer.append(tipo)

    const descripcionContainer = $('<div class = "text-start"></div>');
    const descripcion = $('<p class="mb-0"> ' + element.descripcion + '</p>')
    descripcionContainer.append(descripcion)

    cajaInfo.append(infoContainer, tipoContainer, descripcionContainer)

    caja.append(imagen, cajaInfo)

    $("#divListadoJuegos").append(caja);
}