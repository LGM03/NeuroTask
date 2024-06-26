
export default class scene_parejas extends Phaser.Scene {

    constructor() {
        super({ key: "scene_parejas" });
        this.fechaInicio = new Date();
        this.seleccionadas = [];
        this.valores = ["cartaSol", "cartaSol", "cartaMelon", "cartaMelon", "cartaCalavera", "cartaCalavera", "cartaJarra", "cartaJarra", "cartaPez", "cartaPez", "cartaBota", "cartaBota"];
        this.puntuacion = 0
        this.seleccionables = true; // Variable de estado
        this.fallos = 0;
    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
        this.plan = data.plan

        if (this.plan != null) {
            this.nivel = this.plan.nivel
        }
    }


    create() {
        var self = this

        switch (this.nivel) {
            case 1:  //dificultad facil juega solo con 6 cartas
                this.valores = this.valores.slice(0, 6)
                break;
            case 2://dificultad media juega solo con 8 cartas
                this.valores = this.valores.slice(0, 8)
                break;
        }

        $("#ventanaOrden").removeClass("d-none")
        $("#textoOrden").text("Encuentra las parejas")

        Phaser.Utils.Array.Shuffle(this.valores);

        // Crear cartas en un bucle
        for (var i = 0; i < this.valores.length; i++) {
            var nuevaCarta = $("<div class='carta col-lg-3 col-md-3 col-3 d-flex justify-content-around align-items-center' id = '" + i + "' data-valor='" + this.valores[i] + "' data-seleccionable='true'><img src='/javascripts/assets/carta.png' alt='" + this.valores[i] + "' class='img-fluid'></div>");

            // Agregamos el nuevo div al contenedor
            $("#contenedorCartas").append(nuevaCarta);
        }

        $(".carta").on("click", function (event) {

            var valor = $(this).data(valor)
            if (self.seleccionables && $(this).data("seleccionable") && self.seleccionadas.length < 2) { //Si se puede pulsar y la carta esta disponible
                self.seleccionadas.push($(this).attr("id")); //Me guardo el id de la carta pulsada
                $(this).data("seleccionable", false) //La carta deja de estar disponible para pulsar

                $(this).children('img').attr('src', '/javascripts/assets/' + $(this).data("valor") + '.png') //cambio su imagen para descubrir su valor 

                if (self.seleccionadas.length === 2) { //Cuando se han seleccionado dos cartas
                    setTimeout(function () {
                        self.seleccionables = false;
                        if ($("#" + self.seleccionadas[0]).data("valor") == $("#" + self.seleccionadas[1]).data("valor")) {
                            var $carta1 =  $("#" + self.seleccionadas[0])
                            $("#" + self.seleccionadas[0]).addClass('cubrirImagenCorrecta')
                            setTimeout(function () {
                                $carta1.removeClass('cubrirImagenCorrecta');
                            }, 1000);

                            var $carta2 =  $("#" + self.seleccionadas[1])
                            $("#" + self.seleccionadas[1]).addClass('cubrirImagenCorrecta')
                            setTimeout(function () {
                                $carta2.removeClass('cubrirImagenCorrecta');
                            }, 1000);
                            self.puntuacion += 1;

                        } else { //En caso de que las cartas no coincidan
                            self.fallos++;
                            var $carta1 =  $("#" + self.seleccionadas[0])
                            $("#" + self.seleccionadas[0]).addClass('cubrirImagen')
                            setTimeout(function () {
                                $carta1.removeClass('cubrirImagen');
                            }, 1000);

                            var $carta2 =  $("#" + self.seleccionadas[1])
                            $("#" + self.seleccionadas[1]).addClass('cubrirImagen')
                            setTimeout(function () {
                                $carta2.removeClass('cubrirImagen');
                            }, 1000);

                            $("#" + self.seleccionadas[0]).children('img').attr('src', '/javascripts/assets/carta.png') //cambio su imagen
                            $("#" + self.seleccionadas[1]).children('img').attr('src', '/javascripts/assets/carta.png') //cambio su imagen
                            $("#" + self.seleccionadas[0]).data("seleccionable", true)
                            $("#" + self.seleccionadas[1]).data("seleccionable", true)
                        }
                        self.seleccionadas = [] //Vacio la lista
                        self.seleccionables = true
                    }, 1250);
                }
            }

        })

    }

    update(time, delta) {

        if (this.puntuacion === this.valores.length / 2) { //Cuando ya he encontrado todas --> Salida
            this.finalizarJuego()
        }
    }

    //Logica para llamar a la escena final pasando aciertos, fallos y tiempo invertido.
    finalizarJuego() {
        $('canvas').css('z-index', '2');
        $('#ventanaOrden').css('z-index', '1');
        $('#ventanaOrden').addClass('d-none')
        var fechaFin = new Date();
        var tiempoTranscurrido = fechaFin - this.fechaInicio
        const minutos = Math.floor(tiempoTranscurrido / 60000);
        const segundos = parseInt(((tiempoTranscurrido % 60000) / 1000).toFixed(0));
        // Por ejemplo, puedes cambiar a otra escena
        this.scene.start("scene_fin",
            {
                aciertos: this.puntuacion,
                fallos: this.fallos,
                idJuego: this.idJuego,
                fechaInicio: this.fechaInicio,
                duracion: { minutos, segundos },
                segundos: minutos * 60 + segundos,
                nivel: this.nivel,
                plan: this.plan
            });
    }
    //Logica para cubrir la carta con un color en caso de acierto
    cubrirCartaCorrecta(carta) {
        const scaleX = carta.scaleX;
        const scaleY = carta.scaleY;

        const cover = this.add.rectangle(carta.x, carta.y, carta.width * scaleX, carta.height * scaleY, 0x00FF00, 0.5);
        cover.setOrigin(0, 0);

        this.tweens.add({
            targets: cover,
            alpha: 0,
            duration: 2000,
            ease: 'Linear',
            onComplete: () => {
                cover.destroy();
            }
        });
    }
//Logica para cubrir la carta con un color en caso de fallo
    cubrirCartaErronea(carta) {
        const scaleX = carta.scaleX;
        const scaleY = carta.scaleY;

        const cover = this.add.rectangle(carta.x, carta.y, carta.width * scaleX, carta.height * scaleY, 0xFF0000, 0.5);
        cover.setOrigin(0, 0);

        this.tweens.add({
            targets: cover,
            alpha: 0,
            duration: 2000,
            ease: 'Linear',
            onComplete: () => {
                cover.destroy();
            }
        });
    }



}
