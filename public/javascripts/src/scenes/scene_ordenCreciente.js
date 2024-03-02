
export default class scene_ordenCreciente extends Phaser.Scene {

    constructor() {
        super({ key: "scene_ordenCreciente" });
        this.fechaInicio = new Date();
        this.seleccionadas = [];
        this.valores = ["cartaSol", "cartaMelon", "cartaCalavera", "cartaJarra", "cartaPez", "cartaBota", "cartaBarril", "cartaCampana", "cartaCorazon", "cartaBotella", "cartaSandia", "cartaParaguas"];
        this.cartas = { "cartaSol": 17, "cartaMelon": 18, "cartaCalavera": 19, "cartaJarra": 20, "cartaPez": 21, "cartaBota": 22, "cartaBarril": 41, "cartaCampana": 42, "cartaCorazon": 43, "cartaBotella": 44, "cartaSandia": 45, "cartaParaguas": 46 }
        this.puntuacion = 0;
        this.ordenValido = [17, 18, 19, 20, 21, 22, 41, 42, 43, 44, 45, 46]
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
                this.valores = this.valores.slice(0,6)
                break;
            case 2://dificultad media juega solo con 8 cartas
                this.valores = this.valores.slice(0,8)
                break;
            //dificultad dificil juega con todas
        }
        
        $("#ventanaOrden").removeClass("d-none")
        $("#textoOrden").text("Ordena de MENOR a MAYOR")

        Phaser.Utils.Array.Shuffle(this.valores);

        // Crear cartas en un bucle
        for (var i = 0; i < this.valores.length; i++) {
            var nuevaCarta = $("<div class='carta col-lg-3 col-md-3 col-4 d-flex justify-content-around align-items-center' id='" + this.valores[i] + "' data-valor='" + this.cartas[this.valores[i]] + "'><img src='/javascripts/assets/" + this.valores[i] + ".png' alt='" + this.valores[i] + "' class='img-fluid'><span class='numero d-none'>" + this.cartas[this.valores[i]] + "</span></div>");

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


/*OPERACIONES VARIAS CON ESCENAS:
    this.scene.bringToTop(z ) -> Mueve la escena z delante del todo
    this.scene.sendToBack(z) -> Mueve la escena z atrás del todo
    this.scene.moveUp(z) -> Mueve la escena z una posicion hacia delante
    this.scene.moveDown(z) ->Mueve la escena z una posicion hacia atras
    this.scene.moveAbove(z,w) -> Mueve la escena w encima de una escena  z indicada
    this.scene.moveBelow(z,w) -> Mueve la escena  w detras de una escena z indicada 
*/


/*estilos del tecxto 
        color : 'HEX'
        backgroundColor : 'HEX'
        fontSize : px
        padding:{
            top:
            bottom:
            left:
            right:
        }
        
        
        */ 