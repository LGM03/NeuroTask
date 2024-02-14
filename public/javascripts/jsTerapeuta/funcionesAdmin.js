
$(function () {

    //Preparo el modal de las tareas
    $.ajax({
        url: "/admin/leerJuegos",
        method: "GET",
        success: function (datos, b, c) {

            if (datos.length == 0) {
                Toastify({
                    text: "No hay juegos disponibles para asignar",
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

            } else {
                datos.forEach((elem) => {
                    $("#selectJuego").append($('<option>', {
                        value: elem.id,
                        text: elem.nombre
                    }));
                })

            }
        },
        error: function (a, b, c) {
            Toastify({
                text: "No se pudo cargar el listado de juegos",
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
    })


    $("#listarPacientes").on("click", function (event) {

        $("#cuadranteCalendario").addClass("d-none")
        $("#cuadranteHistorial").addClass("d-none")
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
        $("#cuadranteHistorial").addClass("d-none")
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
        $("#cuadranteHistorial").removeClass("d-none")

        $.ajax({
            method: "GET",
            url: "/tareas/partidasUsuario",
            data: { usuario: usuario },
            success: function (datos, state, jqXHR) {

                console.log(datos)
                if (datos.length != 0) {
                    console.log("A")
                    datos.forEach(function (dato, indice) {
                        console.log(dato)
                        const date = new Date(dato.fechaInicio);

                        const formattedDate = `${("0" + date.getUTCDate()).slice(-2)}-${("0" + (date.getUTCMonth() + 1)).slice(-2)}-${date.getUTCFullYear()} ${("0" + date.getUTCHours()).slice(-2)}:${("0" + date.getUTCMinutes()).slice(-2)}`;

                        var fila = '<tr><td>' + (indice + 1) + '</td><td>' + dato.nombre + '</td><td>' + dato.categoria + '</td><td>' + dato.aciertos + '</td><td>' + dato.fallos + '</td><td>' + dato.duracion + '</td><td>' + formattedDate + '</td></tr>';

                        $("#bodyTablaHistorial").append(fila);
                    });
                } else {
                    Toastify({
                        text: "No hay tareas en el histórico",
                        duration: 3000,
                        newWindow: true,
                        close: true,
                        gravity: "bottom", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "#FFFFFF",
                            color: "#fe8ee5",
                            border: "#fe8ee5"
                        }
                    }).showToast();

                }
            },
            error: function (jqXHR, statusText, errorThrown) {
                Toastify({
                    text: "Ha ocurrido un error con el historial",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "#FFFFFF",
                        color: "#fe8ee5",
                        border: "#fe8ee5"
                    }
                }).showToast();

            }
        });


    })

    $(document).on("click", ".btnVerPlanificacion", function () {
        $('#calendario').fullCalendar('removeEvents');
        $('#calendario').fullCalendar('removeEventSources');
        $('#calendario').fullCalendar('destroy');
        var divContenedor = $(this).closest('.cajaPaciente');
        $("#cuadranteHistorial").addClass("d-none")
        var usuario = divContenedor.data("correo")
        divContenedor.removeClass('cajaPaciente')
        $("#divListadoUsuarios .cajaPaciente").remove()
        divContenedor.addClass('cajaPaciente')
        $("#tituloUsuarios").text("Planificación del usuario")
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
                        if (datos.length != 0) {
                            cell.css("background-color", "rgba(189, 236, 182)");  //amarillo para dias con momentos libres                           
                        }
                    },
                    error: function (jqXHR, statusText, errorThrown) {
                        Toastify({
                            text: "Ha ocurrido un error con el calendario",
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
                });

            }, dayClick: function (date, jsEvent, view) {
                $(".tareaJugador").remove()
                var data = { //Paso a la consulta el usuario y dia en cuestion
                    usuario: usuario,
                    dia: date.format('YYYY-MM-DD')  // Utiliza date.format para obtener la fecha en el formato deseado
                };

                $("#diaModal").text("Tarea para el " + date.format('DD-MM-YYYY'))
                $("#diaModal").data("fecha",  date.format('YYYY-MM-DD'))
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
                                console.log(dato.idTarea)
                                if (dato.hecho == 0) {
                                    var fila = '<tr class = "tareaJugador" data-idtarea="' + dato.idTarea + '"><td> <button class = "btn btn-danger btnEliminarTarea">X Eliminar</button> </td><td>' + dato.nombre + '</td><td>' + dato.categoria + '</td><td>' + "No" + '</td></tr>';
                                } else {
                                    var fila = '<tr class = "tareaJugador" data-idtarea="' + dato.idTarea + '"><td></td><td>' + dato.nombre + '</td><td>' + dato.categoria + '</td><td>' + "Si" + '</td></tr>';
                                }
                                $("#bodyTabla").append(fila);

                            });
                        } else {
                            Toastify({
                                text: "No hay tareas asignadas para esta fecha",
                                duration: 3000,
                                newWindow: true,
                                close: true,
                                gravity: "bottom", // `top` or `bottom`
                                position: "right", // `left`, `center` or `right`
                                stopOnFocus: true, // Prevents dismissing of toast on hover
                                style: {
                                    background: "#FFFFFF",
                                    color: "#fe8ee5",
                                    border: "#fe8ee5"
                                }
                            }).showToast();

                        }
                    },
                    error: function (jqXHR, statusText, errorThrown) {
                        Toastify({
                            text: "Ha ocurrido un error con el calendario",
                            duration: 3000,
                            newWindow: true,
                            close: true,
                            gravity: "bottom", // `top` or `bottom`
                            position: "right", // `left`, `center` or `right`
                            stopOnFocus: true, // Prevents dismissing of toast on hover
                            style: {
                                background: "#FFFFFF",
                                color: "#fe8ee5",
                                border: "#fe8ee5"
                            }
                        }).showToast();

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
            data: data,
            success: function (datos, state, jqXHR) {

                if (datos == 0) {
                    Toastify({
                        text: "No se pudo eliminar la tarea",
                        duration: 3000,
                        newWindow: true,
                        close: true,
                        gravity: "bottom", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "#FFFFFF",
                            color: "#fe8ee5",
                            border: "#fe8ee5"
                        }
                    }).showToast();
                } else {
                    divTarea.slideUp(1000)
                }
            },
            error: function (jqXHR, statusText, errorThrown) {
                Toastify({
                    text: "No se pudo eliminar la tarea",
                    duration: 3000,
                    newWindow: true,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "#FFFFFF",
                        color: "#fe8ee5",
                        border: "#fe8ee5"
                    }
                }).showToast();
            }
        })



    })

    $("#asignarTarea").on("click", function (event) {

        var freq = $("#frecuencia").prop("value")
        var juego = $("#selectJuego").prop("value")

        if (freq != "" && juego != "") {
            var dia = $("#diaModal").data("fecha")
            var usuario = $("#diaModal").data("usuario")
            var data = {
                usuario: usuario,
                juego: juego
            }
            console.log(freq)
            switch (freq) {
                case "0"://Si el juego se juega puntualmente ese dia  Inserto fecha y repetir a false
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
                    console.log("datos")
                    var text
                    if (datos == 0) {
                        text = "No se pudo asignar la tarea"
                    } else {
                        text = "Tarea asignada con éxito"
                    }
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
                            color: "#fe8ee5",
                            border: "#fe8ee5"
                        }
                    }).showToast();

                    $("#crearTarea").modal("close")
                },
                error: function (jqXHR, statusText, errorThrown) {
                    Toastify({
                        text: "No se pudo asignar la tarea",
                        duration: 3000,
                        newWindow: true,
                        close: true,
                        gravity: "bottom", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "#FFFFFF",
                            color: "#fe8ee5",
                            border: "#fe8ee5"
                        }
                    }).showToast();
                }
            })
        }
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