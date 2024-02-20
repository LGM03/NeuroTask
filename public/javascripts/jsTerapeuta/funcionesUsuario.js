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
            } else{
                plan=datos
                $("#btnJugarPlan").removeClass("d-none")
                $("#textoElige").addClass("d-none")
            }
            console.log(plan)
        },
        error: function (jqXHR, statusText, errorThrown) {
            nuevoToast("Ha ocurrido un error con el calendario")

        }
    });

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