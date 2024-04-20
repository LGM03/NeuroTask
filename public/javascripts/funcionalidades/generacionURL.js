
$(function () {

    $(document).on("click", ".btnCopiarURL", function (event) {
        event.preventDefault()
        var divContenedor = $(this).closest('.cajaPaciente');
        var usuario = divContenedor.data("correo")

        $.ajax({
            method: "GET",
            url: "./generar-url",
            data: { usuario: usuario },
            success: function (datos, state, jqXHR) {
                if (datos != 0) {
                    console.log(datos)
                    const elementoTemporal = $('<textarea>');
                    elementoTemporal.val(datos);
                    $('body').append(elementoTemporal);
                    // Seleccionar el texto dentro del elemento de texto
                    elementoTemporal.select();
                    // Copiar el texto al portapapeles
                    document.execCommand('copy');
                    // Eliminar el elemento temporal
                    elementoTemporal.remove();
                    nuevoToast("URL copiada en portapapeles")
                } else {
                    nuevoToast("No se pudo generar la url de inicio de sesión")
                }

            },
            error: function (jqXHR, statusText, errorThrown) {
                nuevoToast("No se pudo generar la url de inicio de sesión")
            }
        });
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