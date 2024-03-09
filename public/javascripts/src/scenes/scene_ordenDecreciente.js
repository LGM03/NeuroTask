
export default class scene_ordenDecreciente extends Phaser.Scene {

    constructor() {
        super({ key: "scene_ordenDecreciente" });
        this.fechaInicio = new Date();
        this.seleccionadas = [];
        this.valores = ["cartaParaguas", "cartaSandia", "cartaBotella", "cartaCorazon", "cartaCampana", "cartaBarril", "cartaBota", "cartaPez", "cartaJarra", "cartaCalavera", "cartaMelon", "cartaSol"];
        this.cartas = {
            "cartaParaguas": 46,
            "cartaSandia": 45,
            "cartaBotella": 44,
            "cartaCorazon": 43,
            "cartaBarril": 41,
            "cartaCampana": 42,
            "cartaBota": 22,
            "cartaPez": 21,
            "cartaJarra": 20,
            "cartaCalavera": 19,
            "cartaMelon": 18,
            "cartaSol": 17
        }
        this.puntuacion = 0;
        this.ordenValido = [46, 45, 44, 43, 42, 41, 22, 21, 20, 19, 18, 17]
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
            //dificultad dificil juega con todas
        }

        $("#ventanaOrden").removeClass("d-none")
        $("#textoOrden").text("Ordena de MAYOR a MENOR")

        Phaser.Utils.Array.Shuffle(this.valores);

        // Crear cartas en un bucle
        for (var i = 0; i < this.valores.length; i++) {
            var nuevaCarta = $("<div class='carta col-lg-3 col-md-3 col-3 d-flex justify-content-around align-items-center' id='" + this.valores[i] + "' data-valor='" + this.cartas[this.valores[i]] + "'><img src='/javascripts/assets/" + this.valores[i] + ".png' alt='" + this.valores[i] + "' class='img-fluid'><span class='numero d-none'>" + this.cartas[this.valores[i]] + "</span></div>");

            // Agregamos el nuevo div al contenedor
            $("#contenedorCartas").append(nuevaCarta);
        }

        $(".carta").on("click", function (event) {

            var valor = $(this).data(valor)
            console.log(valor)
            console.log(self.ordenValido[self.puntuacion])
            if (valor.valor == self.ordenValido[self.puntuacion]) { //Si el valor de la carta que pulso sigue el orden
                $(this).children('span').removeClass('d-none')
                $(this).children('img').addClass('sombra');
                self.puntuacion++

            } else {
                self.fallos++;
                var $this = $(this);
                $(this).addClass('cubrirImagen')
                setTimeout(function () {
                    $this.removeClass('cubrirImagen');
                }, 1000);
            }
        })

    }


    update(time, delta) {
        console.log(this.puntuacion + " " + this.valores.length)

        if (this.puntuacion === this.valores.length) { //Cuando ya he encontrado todas Salida
            console.log("este es el final")
            this.finalizarJuego()
        }
    }


    finalizarJuego() {
        var fechaFin = new Date();
        var tiempoTranscurrido = fechaFin - this.fechaInicio
        const minutos = Math.floor(tiempoTranscurrido / 60000);
        const segundos = ((tiempoTranscurrido % 60000) / 1000).toFixed(0);

        $('canvas').css('z-index', '2');
        $('#ventanaOrden').css('z-index', '1');
        $('#ventanaOrden').addClass('d-none')
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



}
