$(function(){

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
        var idTarea = $(this).closest('tr.tareaJugador').data("idtarea");
        var divTarea = $(this).closest('tr.tareaJugador')
        var data = { id: idTarea };
        if (confirm("Esta tarea y sus repeticiones se eliminarán ¿Estás seguro?")) {
            $.ajax({
                url: "/tareas/eliminar",
                method: "DELETE",
                data: data,
                success: function (datos, state, jqXHR) {

                    if (datos == 0) {
                        nuevoToast("No se pudo eliminar la tarea")
                    } else {
                        nuevoToast("Se eliminó la tarea")
                        divTarea.slideUp(1000)
                    }
                },
                error: function (jqXHR, statusText, errorThrown) {
                    nuevoToast("No se pudo eliminar la tarea")
                }
            })
        }
    })

    $("#asignarTarea").on("click", function (event) {

        var divContenedor = $('.correoPaciente');
        var usuario = divContenedor.text()
        var freq = $("#frecuencia").prop("value")
        var juego = $("#selectJuego").prop("value")
        var nivel = $("#selectNivel").prop("value")
        if (freq != "" && juego != "") {
            var dia = $("#diaModal").data("fecha")
            var usuario = $("#diaModal").data("usuario")
            var data = {
                usuario: usuario.trim(),
                juego: juego,
                nivel: nivel
            }
            switch (freq) { //Se usa valor entero en lugar de bool para facilitar el insert en la base de datos
                case "0"://Si el juego se juega puntualmente ese dia  Inserto fecha y repetir a false
                    data.seRepite = 0
                    data.fecha = dia
                    break
                case "1":  //Si se debe jugar todos los dias inserto solo repetir a true y sin fecha
                    data.seRepite = 1
                    data.fecha = null
                    break
                case "2": //Si se debe jugar cada 7 dias inserto fecha y repetir a true
                    data.seRepite = 1
                    data.fecha = dia
            }

            $.ajax({
                url: "/tareas/asignar",
                method: "POST",
                data: data,
                success: function (datos, state, jqXHR) {

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
                var today = new Date();
                var cellDate = new Date(date);

                if (cellDate.toDateString() === today.toDateString()) {
                    cell.addClass("calendarioHoy")
                    cell.css("background", "none")
                    
                }

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
                            cell.css("background-color", "#FFE3FE");  //amarillo para dias con momentos libres                           
                        } else {
                            cell.addClass("sinfondo")
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
                                    var fila = '<tr class = "tareaJugador" data-idtarea="' + dato.idTarea + '"><td> <button class = "btn btn-danger btnEliminarTarea">X Eliminar</button> </td><td>' + dato.nombre + '</td><td>' + dato.categoria + '</td><td>' + dato.nivel + '</td><td>' + "No" + '</td></tr>';
                                } else {
                                    var fila = '<tr class = "tareaJugador" data-idtarea="' + dato.idTarea + '"><td></td><td>' + dato.nombre + '</td><td>' + dato.categoria + '</td><td>' + dato.nivel + '</td><td> Si' + '</td></tr>';
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