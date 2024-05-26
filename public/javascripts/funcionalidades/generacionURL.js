
$(function () {
    //logica para la generacion de un enlace de inicio de sesion automatico
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
                    elementoTemporal.select(); 
                    document.execCommand('copy'); // Copiar el texto al portapapeles
                    // Eliminar el elemento temporal
                    elementoTemporal.remove();
                    nuevoToast("URL copiada en portapapeles")
                } else {
                    nuevoToast("No se pudo generar la url de inicio de sesión")
                }

            },
            error: function (jqXHR, statusText, errorThrown) { //Cuando ocurra un error muestro un toast 
                nuevoToast("No se pudo generar la url de inicio de sesión")
            }
        });
    })
})

//Logica ara mostrar un toast abajo a la derecha
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