
$(function(){


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
                    $("#comentarioNuevo").val("")
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
})

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