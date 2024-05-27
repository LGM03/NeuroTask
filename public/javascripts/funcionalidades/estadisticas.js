$(function () {
    //Cuando pulso el boton de ver estadisticas 
    $(document).on("click", ".btnVerEstadisticas", function () {
        $('.cajaGraficas').empty()
        $('canvas').remove()
        $('#cajaRendimientoGeneral').empty()
        $("#cajaEstadisticas").addClass('d-none')
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

        $.ajax({ //Veo las estadisticas generales de un paciente por categoria
            method: "GET",
            url: "/juego/leerCategorias",
            success: function (datos, state, jqXHR) {
                $("#selectCategorias").data("usuario", usuario)
                if ($("#selectCategorias").find("option").length == 0) {
                    datos.forEach(function (dato) {
                        $("#selectCategorias").append($('<option>', {
                            value: dato.id_cat,
                            text: dato.categoria
                        }));

                    });
                }
            },
            error: function (jqXHR, statusText, errorThrown) {
                nuevoToast("Ha ocurrido un error con las categorias") //Si ha ocurrido un error lo indico
            }
        });

        Chart.defaults.font.size = 22;
        $.ajax({ //Muestro graficas por rendimiento general 
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

                    const myChart = new Chart(ctx, { //Creo una grafica de aciertos sobre intentos 
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Tasa de Aciertos (Aciertos/Intentos)',
                                    data: aciertos,
                                    backgroundColor: 'rgba(75, 192, 192, 0.4)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
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
                    //Si no tengo informacion que mostrar lo indico
                    nuevoToast("No hay rendimiento general disponible para mostrar")
                    var alerta = $('<div class="alert alert-secondary mt-3" role="alert" id = "alertaEstadisticas"> No hay estadísticas disponibles </div>');
                    $("#cajaRendimientoGeneral").append(alerta)
                }
            },
            error: function (jqXHR, statusText, errorThrown) {
                nuevoToast("Ha ocurrido un error con las categorias") //Si ha ocurrido un error lo indico
            }
        });
    })
    //Boton para ver las graficas de una categoria concreta
    $('#btnGraficos').on("click", function (event) {
        event.preventDefault()
        $("#cajaGraficoJuego").empty()
        $("#cajaGraficoJuegoTotal").empty()
        $("#cajaGraficoHechos").empty()
        $("#cajaGraficoProgreso").empty()
        $(".alertaEstadisticas").remove()
        $("#cajaEstadisticas").removeClass('d-none')
        var opcionSeleccionada = $("#selectCategorias").val();
        var fechaSeleccionada = $("#selectMeses").val();
        var usuario = $("#selectCategorias").data("usuario")

        $.ajax({  //Consulto los valores de las planificaciones 
            method: "GET",
            url: "/tareas/planificacionesJugadas",
            data: { categoria: opcionSeleccionada, usuario: usuario, fecha: fechaSeleccionada },
            success: function (datos, state, jqXHR) {
                if (datos.contador + datos.hecho == 0) {  //Si no hay ninguna datos aviso al usuario
                    nuevoToast("No hay estadísticas sobre planificación disponibles para mostrar")
                    var alerta = $('<div class="alert alert-secondary alertaEstadisticas mt-3" role="alert"> No hay estadísticas sobre planificación </div>');
                    $("#cajaGraficoHechos").append(alerta)
                } else { 

                    $("#cajaGraficoHechos .alertaEstadisticas").remove()

                    //Creo el canva
                    var canvas = document.createElement('canvas');
                    var titulo = $('<p><strong>Relación de planificación cumplida</strong></p>');

                    //Meto el canva en el div
                    var container = $('#cajaGraficoHechos');
                    container.empty();
                    container.append(titulo)
                    container.append(canvas);

                    var ctx = canvas.getContext('2d');

                    // Configuración de la gráfica para mostrar la proporcion de planificacion pendiente 
                    var config = {
                        type: 'pie',
                        data: {
                            labels: ['Cumplida', 'Pendiente'],
                            datasets: [{
                                data: [datos.hecho, datos.contador],
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

        $.ajax({ //Recojo la informacion del progeso de una categoria concreta 
            method: "GET",
            url: "/tareas/progresoCategoria",
            data: { categoria: opcionSeleccionada, usuario: usuario, fecha: fechaSeleccionada },
            success: function (datos, state, jqXHR) {
                if (datos.length == 0) {  //Si no hay nada que mostrar lo indico
                    $("#cajaJuegoConcreto").addClass('d-none')
                    nuevoToast("No hay estadísticas sobre esta categoría disponibles para mostrar")
                    var alerta = $('<div class="alert alert-secondary alertaEstadisticas mt-3" role="alert" > No hay estadísticas sobre progreso </div>');
                    $("#cajaGraficoProgreso").append(alerta)
                } else {  //Si hay datos muestro el canvas

                    formJuegoConcreto(opcionSeleccionada)
                    $("#cajaGraficoProgreso .alertaEstadisticas").remove()

                    //Creo el canva
                    const canvas = document.createElement('canvas');
                    canvas.width = 300
                    canvas.height = 300
                    var titulo = $('<p><strong>Progreso Mensual General</strong></p>');

                    //Meto el canva en el div
                    const container = $('#cajaGraficoProgreso');
                    container.empty();
                    container.append(titulo)
                    container.append(canvas);
                    const ctx = canvas.getContext('2d');

                    const labels = datos.map(item => 'Semana ' + item.semana);
                    var dataAciertos = datos.map(item => item['tasaAciertos']);
                    var dataMedia = datos.map(item => item['tasaMediaAciertos']);

                    const myChart = new Chart(ctx, { //muestro una grafica para ver las estadisticas de una categoria
                        type: 'bar',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Aciertos',
                                    data: dataAciertos,
                                    backgroundColor: 'rgba(75, 192, 192, 0.4)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Aciertos Generales',
                                    data: dataMedia,
                                    backgroundColor: 'rgba(255, 99, 132, 0.4)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1
                                }
                            ]
                        }
                    });

                }
            },
            error: function (jqXHR, statusText, errorThrown) { //Si ha ocurrido un error aviso al usuario
                nuevoToast("Ha ocurrido un error con las estadísticas")
            }
        })
    })
    //Boton para ver las graficas para un juego concreto
    $("#btnGraficosJuego").on("click",function(event){
        event.preventDefault()
        var juego = $("#selectJuegoConcreto").val() //Obtengo el id del juego del que se quiere saber la estadistica
        var usuario= $("#selectCategorias").data("usuario")  //Obtengo el id del usuario del que se quiere saber la estadistica
        var fechaSeleccionada = $("#selectMeses").val();
        $.ajax({ 
            method: "GET",
            url: "/tareas/progresoJuegoConcreto",
            data: { juego : juego, usuario: usuario, fechaSeleccionada : fechaSeleccionada }, 
            success: function (datos, state, jqXHR) {
                if (datos.length == 0) {  
                    nuevoToast("No hay estadísticas sobre este juego disponibles para mostrar")
                    var alerta = $('<div class="alert alert-secondary alertaEstadisticas mt-3" role="alert" > No hay estadísticas sobre el juego </div>');
                    $("#cajaGraficoJuego").empty()
                    $("#cajaGraficoJuego").append(alerta)
                    
                } else {  //Si hay datos muestro el canvas

                    $("#cajaGraficoJuego .alertaEstadisticas").remove()

                    //Creo el canva
                    const canvas = document.createElement('canvas');
                    canvas.width = 300
                    canvas.height = 300
                    var titulo = $('<p><strong>Progreso Juego Mensual</strong></p>');

                    //Meto el canva en el div
                    const container = $('#cajaGraficoJuego');
                    container.empty();
                    container.append(titulo)
                    container.append(canvas);
                    const ctx = canvas.getContext('2d');

                    const labels = datos.map(item => item.dia);
                    var dataAciertos = datos.map(item => item['tasaAciertos_jugador']);
                    var dataMedia = datos.map(item => item['tasaAciertos_media_deterioro']);

                    const myChart = new Chart(ctx, { // Creo una grafica para ver las estadisticas de un juego
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Aciertos',
                                    data: dataAciertos,
                                    backgroundColor: 'rgba(75, 192, 192, 0.4)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Aciertos Generales',
                                    data: dataMedia,
                                    backgroundColor: 'rgba(255, 99, 132, 0.4)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1
                                }
                            ]
                        }
                    });

                }
            },
            error: function (jqXHR, statusText, errorThrown) { //Si ha ocurrido un error aviso al usuario
                nuevoToast("Ha ocurrido un error con las estadísticas")
            }
        })

        $.ajax({  
            method: "GET",
            url: "/tareas/progresoJuegoTotal",
            data: { juego : juego, usuario: usuario, fechaSeleccionada : fechaSeleccionada }, 
            success: function (datos, state, jqXHR) {
                if (datos.length == 0) {  
                    nuevoToast("No hay estadísticas sobre este juego disponibles para mostrar")
                    var alerta = $('<div class="alert alert-secondary alertaEstadisticas mt-3" role="alert" > No hay estadísticas sobre el juego </div>');
                    $("#cajaGraficoJuegoTotal").empty()
                    $("#cajaGraficoJuegoTotal").append(alerta)
                } else {  //Si hay datos muestro el canvas

                    $("#cajaGraficoJuegoTotal .alertaEstadisticas").remove()

                    //Creo el canva
                    const canvas = document.createElement('canvas');
                    canvas.width = 300
                    canvas.height = 300
                    var titulo = $('<p><strong>Progreso Juego Total</strong></p>');

                    //Meto el canva en el div
                    const container = $('#cajaGraficoJuegoTotal');
                    container.empty();
                    container.append(titulo)
                    container.append(canvas);
                    const ctx = canvas.getContext('2d');

                    const labels = datos.map(item => item.mes);
                    var dataAciertos = datos.map(item => item['tasaAciertos_jugador']);
                    var dataMedia = datos.map(item => item['tasaAciertos_media_deterioro']);

                    const myChart = new Chart(ctx, { //Creo la grafica para mostrar estadisticas generales
                        type: 'line',
                        data: {
                            labels: labels,
                            datasets: [
                                {
                                    label: 'Aciertos',
                                    data: dataAciertos,
                                    backgroundColor: 'rgba(75, 192, 192, 0.4)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1
                                },
                                {
                                    label: 'Aciertos Generales',
                                    data: dataMedia,
                                    backgroundColor: 'rgba(255, 99, 132, 0.4)',
                                    borderColor: 'rgba(255, 99, 132, 1)',
                                    borderWidth: 1
                                }
                            ]
                        }
                    });

                }
            },
            error: function (jqXHR, statusText, errorThrown) { //Si ha ocurrido un error aviso al usuario
                nuevoToast("Ha ocurrido un error con las estadísticas")
            }
        })
    })
    function formJuegoConcreto(categoria) { //funcion de form para seleccionar un juego concreto
        $("#cajaJuegoConcreto").removeClass('d-none')

        $.ajax({ //leo todos los juegos en funcion de su categoria
            method: "GET",
            url: "/juego/juegosPorCategoria",
            data: { categoria: categoria },
            success: function (datos, state, jqXHR) {
                $("#selectJuegoConcreto").empty()
                datos.forEach(function (dato) {
                    $("#selectJuegoConcreto").append($('<option>', { //agrego la informacion a un select
                        value: dato.id,
                        text: dato.nombre
                    }));
                });
            },
            error: function (jqXHR, statusText, errorThrown) {
                nuevoToast("Ha ocurrido un error con las categorias") //Si ocurre algun error informo
            }
        });

    }
})
//Funcion para mostrar un toast abajo a la derecha
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