
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
                        text: elem.nombre
                    }));
                })
                $("#selectJuego option[value='1']").prop("selected", true);
            }
        },
        error: function (a, b, c) {
            nuevoToast("No se pudo cargar el listado de juegos")
        }
    })


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
        $("#cuadranteCalendario").addClass("d-none")
        $("#cuadranteComentarios").addClass("d-none")
        $("#cuadranteHistorial").addClass("d-none")
        $("#cuadranteEstadisticas").addClass("d-none")
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

    $(document).on("click", ".btnVerHistorial", function () {
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

        $.ajax({
            method: "GET",
            url: "/tareas/partidasUsuario",
            data: { usuario: usuario },
            success: function (datos, state, jqXHR) {

                console.log(datos)
                if (datos.length != 0) {

                    datos.forEach(function (dato, indice) {
                        console.log(dato)
                        const date = new Date(dato.fechaInicio);

                        const formattedDate = `${("0" + date.getUTCDate()).slice(-2)}-${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${date.getUTCFullYear()} ${("0" + date.getUTCHours()).slice(-2)}:${("0" + date.getUTCMinutes()).slice(-2)}`;

                        var fila = '<tr><td>' + (indice + 1) + '</td><td>' + dato.nombre + '</td><td>' + dato.categoria + '</td><td>' + dato.aciertos + '</td><td>' + dato.fallos + '</td><td>' + dato.duracion + '</td><td>' + formattedDate + '</td></tr>';

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

    $(document).on("click", ".btnVerComentarios", function () {
        $('#cajaComentarios').empty()
        var divContenedor = $(this).closest('.cajaPaciente');
        var usuario = divContenedor.data("correo")
        divContenedor.removeClass('cajaPaciente')
        $("#divListadoUsuarios .cajaPaciente").remove()
        divContenedor.addClass('cajaPaciente')
        $("#btnEnviarComentario").data("usuario", usuario)

        $("#tituloUsuarios").text("Anotaciones sobre el usuario")
        $("#cuadranteEstadisticas").addClass("d-none")
        $("#cuadranteCalendario").addClass("d-none")
        $("#cuadranteHistorial").addClass("d-none")
        $("#cuadranteComentarios").removeClass("d-none")

        $.ajax({
            method: "GET",
            url: "/comentarios/leerPorUsuario",
            data: { usuario: usuario },
            success: function (datos, state, jqXHR) {
                if (datos.length != 0) {
                    datos.forEach(function (dato) {

                        nuevaCajaComentario(dato)

                    });
                } else {
                    var alerta = $('<div class="alert alert-secondary" role="alert" id = "alertaComentarios"> No hay comentarios disponibles </div>');

                    $("#cajaComentarios").append(alerta)

                    nuevoToast("No hay comentarios")

                }
            },
            error: function (jqXHR, statusText, errorThrown) {
                nuevoToast("Ha ocurrido un error con los comentarios")
            }
        });
    })


    $("#btnEnviarComentario").on("click", function (event) {
        event.preventDefault()
        $("#alertaComentarios").addClass("d-none")
        var usuario = $("#btnEnviarComentario").data("usuario")

        var comentario = $("#comentarioNuevo").val()

        if (comentario.trim() != "") {
            $.ajax({
                method: "POST",
                url: "/comentarios/publicar",
                data: { usuario: usuario, comentario: comentario },
                success: function (datos, state, jqXHR) {
                    if (datos != 0) {
                        $("#alertaComentarios").addClass("d-none")

                        nuevaCajaComentario(datos)
                    } else {
                        nuevoToast("Ha ocurrido un error con el comentario")
                    }

                },
                error: function (jqXHR, statusText, errorThrown) {
                    nuevoToast("Ha ocurrido un error con el comentario")
                }
            });
        } else {
            nuevoToast("Escriba un comentario para poder publicarlo")
        }
    })


    $(document).on("click", ".btnVerEstadisticas", function () {

        $('#cajaEstadisticas').empty()
        $('#cajaRendimientoGeneral').empty()
        var divContenedor = $(this).closest('.cajaPaciente');
        var usuario = divContenedor.data("correo")
        divContenedor.removeClass('cajaPaciente')
        $("#divListadoUsuarios .cajaPaciente").remove()
        divContenedor.addClass('cajaPaciente')
        $("#tituloUsuarios").text("Estadísticas del Usuario")
        $("#cuadranteCalendario").addClass("d-none")
        $("#cuadranteHistorial").addClass("d-none")
        $("#cuadranteComentarios").addClass("d-none")
        $("#cuadranteEstadisticas").removeClass("d-none")

        $.ajax({
            method: "GET",
            url: "/juego/leerCategorias",
            success: function (datos, state, jqXHR) {
                datos.forEach(function (dato) {
                    $("#selectCategorias").data("usuario", usuario)
                    $("#selectCategorias").append($('<option>', {
                        value: dato.id_cat,
                        text: dato.categoria
                    }));
                });
            },
            error: function (jqXHR, statusText, errorThrown) {
                nuevoToast("Ha ocurrido un error con las categorias")
            }
        });


        $.ajax({
            method: "GET",
            url: "/tareas/rendimientoGeneral",
            data: { usuario: usuario },
            success: function (datos, state, jqXHR) {
                if (datos.length > 0) {
                    const canvas = document.createElement('canvas');
                    var titulo = $('<p><strong>Rendimiento general</strong></p>');

                    //Meto el canva en el div
                    const container = $('#cajaRendimientoGeneral');
                    container.empty();
                    container.append(titulo)
                    container.append(canvas);

                    const ctx = canvas.getContext('2d');

                    const labels = datos.map(item => item.categoria);
                    const aciertos = datos.map(item => item.aciertos);
                    const fallos = datos.map(item => item.fallos);

                    const myChart = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Aciertos',
                                    data: aciertos,
                                    backgroundColor: 'rgba(75, 192, 192, 0.4)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Fallos',
                                    data: fallos,
                                    backgroundColor: 'rgba(255, 99, 132, 0.4)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1
                                }
                            ]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }
                    });

                } else {
                    nuevoToast("No hay estadísticas disponibles para mostrar")
                    var alerta = $('<div class="alert alert-secondary" role="alert" id = "alertaEstadisticas"> No hay estadísticas disponibles </div>');
                    $("#cajaRendimientoGeneral").append(alerta)
                }
            },
            error: function (jqXHR, statusText, errorThrown) {
                nuevoToast("Ha ocurrido un error con las categorias")
            }
        });


    })

    $('#btnGraficos').on("click", function (event) {

        event.preventDefault()
        
        $('#cajaEstadisticas').empty()
        var opcionSeleccionada = $("#selectCategorias").val();
        var fechaSeleccionada = $("#selectMeses").val();
        var usuario = $("#selectCategorias").data("usuario")
        $.ajax({  //Consulto los valores de las reservas para esa facultad
            method: "GET",
            url: "/tareas/planificacionesJugadas",
            data: { categoria: opcionSeleccionada, usuario: usuario, fecha: fechaSeleccionada },
            success: function (datos, state, jqXHR) {
                if (datos.length == 0) {  //Si no hay ninguna reserva aviso al usuario
                    nuevoToast("No hay estadísticas disponibles para mostrar")
                    var alerta = $('<div class="alert alert-secondary" role="alert" id = "alertaEstadisticas"> No hay estadísticas disponibles </div>');
                    $("#cajaEstadisticas").append(alerta)
                } else {  //Si hay reservas muestro el canvas
                    $("#alertaEstadisticas").remove()

                    //Creo el canva
                    const canvas = document.createElement('canvas');
                    var titulo = $('<p><strong>Relación de planificación cumplida</strong></p>');

                    //Meto el canva en el div
                    const container = $('#cajaEstadisticas');
                    container.empty();
                    container.append(titulo)
                    container.append(canvas);

                    const ctx = canvas.getContext('2d');

                    // Configuración de la gráfica
                    const config = {
                        type: 'pie',
                        data: {
                            labels: ['Cumplida', 'Pendiente'],
                            datasets: [{
                                data: [datos[0].contador, datos[1].contador],
                                backgroundColor: [
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(255, 99, 132, 0.2)',
                                ],
                                borderColor: [
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(255, 99, 132, 1)',
                                ],
                                borderWidth: 1
                            }]
                        }
                    };

                    // Crear la gráfica
                    new Chart(ctx, config);

                }


            },
            error: function (jqXHR, statusText, errorThrown) { //Si ha ocurrido un error aviso al usuario
                nuevoToast("Ha ocurrido un error con las estadísticas")
            }
        })
    })



    $(document).on("click", ".btnVerPlanificacion", function () {
        $('#calendario').fullCalendar('removeEvents');
        $('#calendario').fullCalendar('removeEventSources');
        var divContenedor = $(this).closest('.cajaPaciente');
        $("#cuadranteHistorial").addClass("d-none")
        $("#cuadranteEstadisticas").addClass("d-none")
        $("#cuadranteComentarios").addClass("d-none")
        var usuario = divContenedor.data("correo")
        divContenedor.removeClass('cajaPaciente')
        $("#divListadoUsuarios .cajaPaciente").remove()
        divContenedor.addClass('cajaPaciente')
        $("#tituloUsuarios").text("Planificación del usuario")
        $("#cuadranteCalendario").removeClass("d-none")

        //Logica de calendario a mes visto
        crearCalendario(usuario)

    })

    $(document).on("click", ".btnEliminarTarea", function (event) {
        var divContenedor = $(this).closest('.cajaPaciente');
        var usuario = divContenedor.data("correo")
        var idTarea = $(this).closest('tr.tareaJugador').data("idtarea");
        var divTarea = $(this).closest('tr.tareaJugador')
        console.log(idTarea);
        var data = { id: idTarea };
        $.ajax({
            url: "/tareas/eliminar",
            method: "DELETE",
            data: data,
            success: function (datos, state, jqXHR) {

                if (datos == 0) {
                    nuevoToast("No se pudo eliminar la tarea")
                } else {
                    divTarea.slideUp(1000)
                }
            },
            error: function (jqXHR, statusText, errorThrown) {
                nuevoToast("No se pudo eliminar la tarea")
            }
        })
    })

    $("#asignarTarea").on("click", function (event) {

        var divContenedor = $('.correoPaciente');
        var usuario = divContenedor.text()
        var freq = $("#frecuencia").prop("value")
        var juego = $("#selectJuego").prop("value")
        console.log(usuario + " " + freq)
        if (freq != "" && juego != "") {
            var dia = $("#diaModal").data("fecha")
            var usuario = $("#diaModal").data("usuario")
            var data = {
                usuario: usuario.trim(),
                juego: juego
            }
            switch (freq) {
                case "0"://Si el juego se juega puntualmente ese dia  Inserto fecha y repetir a false
                    console.log("es un dia ")
                    data.seRepite = false
                    data.fecha = dia
                    break
                case "1":  //Si se debe jugar todos los dias inserto solo repetir a true y sin fecha
                    data.seRepite = true
                    data.fecha = null
                    break
                case "2": //Si se debe jugar cada 7 dias inserto fecha y repetir a true
                    data.seRepite = true
                    data.fecha = dia
            }

            $.ajax({
                url: "/tareas/asignar",
                method: "POST",
                data: data,
                success: function (datos, state, jqXHR) {

                    var text
                    if (datos == 0) {
                        nuevoToast("No se pudo asignar la tarea")
                    } else {
                        $('#crearTarea').modal('hide');
                        // Refresca el calendario
                        crearCalendario(usuario)

                        nuevoToast("Tarea asignada con éxito")
                    }
                },
                error: function (jqXHR, statusText, errorThrown) {
                    nuevoToast("No se pudo asignar la tarea")
                }
            })
        }
    })

    function crearCalendario(usuario) {
        $("#calendario").fullCalendar('destroy')
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
                        if (datos.length != 0) {
                            cell.css("background-color", "rgba(189, 236, 182)");  //amarillo para dias con momentos libres                           
                        } else {
                            cell.css("background-color", "");
                        }
                    },
                    error: function (jqXHR, statusText, errorThrown) {
                        nuevoToast("Ha ocurrido un error con el calendario")

                    }
                });

            }, dayClick: function (date, jsEvent, view) {
                $(".tareaJugador").remove()
                var data = { //Paso a la consulta el usuario y dia en cuestion
                    usuario: usuario,
                    dia: date.format('YYYY-MM-DD')  // Utiliza date.format para obtener la fecha en el formato deseado
                };

                $("#diaModal").text("Tarea para el " + date.format('DD-MM-YYYY'))
                $("#diaModal").data("fecha", date.format('YYYY-MM-DD'))
                $("#diaModal").data("usuario", usuario)

                $.ajax({ // veo para cada dia que actividades hay
                    method: "GET",
                    url: "/tareas/tareaUsuarioDia",
                    data: data,
                    success: function (datos, state, jqXHR) {

                        $("#divTablaCalendario").removeClass("d-none")
                        $("#tituloTabla").text("Tareas asignadas el " + date.format('DD-MM-YYYY'))

                        if (datos.length != 0) {
                            datos.forEach(function (dato) {
                                if (dato.hecho == 0) {
                                    var fila = '<tr class = "tareaJugador" data-idtarea="' + dato.idTarea + '"><td> <button class = "btn btn-danger btnEliminarTarea">X Eliminar</button> </td><td>' + dato.nombre + '</td><td>' + dato.categoria + '</td><td>' + "No" + '</td></tr>';
                                } else {
                                    var fila = '<tr class = "tareaJugador" data-idtarea="' + dato.idTarea + '"><td></td><td>' + dato.nombre + '</td><td>' + dato.categoria + '</td><td>' + "Si" + '</td></tr>';
                                }
                                $("#bodyTabla").append(fila);

                            });
                        } else {
                            nuevoToast("No hay tareas asignadas para esta fecha")

                        }
                    },
                    error: function (jqXHR, statusText, errorThrown) {
                        nuevoToast("Ha ocurrido un error con el calendario")

                    }
                });

            }

        });
    }
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
    var botonComentarios = $('<button class="alert alert-secondary p-1 w-100 btnVerComentarios"> Ver Anotaciones </button>')

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

function nuevaCajaComentario(dato) {
    var fecha = moment(dato.fecha)
    var comentarioBox = $('<div class="card mb-3">' +
        '<div class="card-header">' +
        '<div class="row">' +
        '<div class="col-md-6">' +
        '<strong class="nombre-usuario"></strong>' +
        '</div>' +
        '<div class="col-md-6 text-end">' +
        '<small class="fecha-comentario"></small>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="card-body">' +
        '<p class="contenido-comentario"></p>' +
        '</div>' +
        '</div>');

    // Insertamos los datos del comentario
    comentarioBox.find('.nombre-usuario').text(dato.idT);
    comentarioBox.find('.fecha-comentario').text(fecha.format("DD-MM-YYYY"));
    comentarioBox.find('.contenido-comentario').text(dato.comentario);

    // Añadimos la caja de comentario al final del div especificado
    $('#cajaComentarios').prepend(comentarioBox);
}

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