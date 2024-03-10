export default class scene_memorizaFiguras extends Phaser.Scene {


    constructor() {
        super({ key: "scene_memorizaFiguras" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.seleccionable = false
        this.cartas = ["cartaCorona", "cartaMaceta", "cartaParaguas", "cartaTambor", "cartaPera", "cartaMelon", "cartaSandia", "cartaMano", "cartaCazo", "cartaBotella", "cartaCorazon", "cartaCampana"]

        this.secuencia_objetivo = []
        this.seleccionadas = []
    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
        this.plan = data.plan

        if (this.plan != null) {
            this.nivel = this.plan.nivel
        }

        switch (this.nivel) {
            case 1:  //dificultad facil juega solo con 6 cartas
                this.cartas = this.cartas.slice(0, 6)
                break;
            case 2://dificultad media juega solo con 8 cartas
                this.cartas = this.cartas.slice(0, 8)
                break;
            //dificultad dificil juega con todas
        }
    }


    create() {
        const MS = 1000
        this.duracion = 80  //en segundos
        this.time.delayedCall(this.duracion * MS, this.finalizarJuego, [], this);  //Finaliza el juego pasado el tiempo

        this.mostrarTres();

        var self = this

        $(document).on("click", ".carta", function (event) {
            console.log("pulsado")
            if (self.seleccionable && $(this).data("seleccionable", true)) {
                console.log("dentro")
                self.seleccionadas.push($(this).data("valor"))//Me guardo el id de la carta selccionada
                $(this).children('img').addClass('sombra');
                $(this).data("seleccionable", false)
                console.log(self.seleccionadas)
                console.log(self.secuencia_objetivo)
                if (self.seleccionadas.length == self.secuencia_objetivo.length) {

                    if (self.seleccionadas.every(element => self.secuencia_objetivo.includes(element))) {
                        self.seleccionadas = []
                        self.secuencia_objetivo = []
                        self.cubrirResultado(true) //true porque es acierto
                        self.puntuacion++;
                    } else {
                        self.fallos++;
                        self.cubrirResultado(false)
                        self.secuencia_objetivo = []
                        self.seleccionadas = []
                    }

                    setTimeout(async () => {
                        self.mostrarTres();
                    }, 1500);
                }
            }
        })
    }


    cubrirResultado(esAcierto) {

        $('canvas').css('z-index', '2');
        $('#ventanaOrden').css('z-index', '1');

        var color = 0xFF0000
        if (esAcierto) {
            var color = 0x00FF00
        }
        const cover = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, color, 0.75);
        cover.setOrigin(0, 0);

        this.tweens.add({
            targets: cover,
            alpha: 0,
            duration: 1500,
            ease: 'Linear',
            onComplete: () => {
                $('canvas').css('z-index', '1');
                $('#ventanaOrden').css('z-index', '2');
                cover.destroy();
            }
        });
    }


    mostrarTres() {
        this.seleccionable = false //ya no se podra seleccionar 
        this.cartasGrupo = this.add.group();
        $("#ventanaMensaje").removeClass('d-none')
        $("#ventanaOrden").addClass('d-none')
        $("#imgMensaje").attr("src", "/javascripts/assets/siguiente.png")
        $("#imgMensaje").attr("alt", "Siguiente Ronda")
        $("#contenedorCartas").empty()
        setTimeout(async () => {
            $("#ventanaMensaje").addClass('d-none')
            $("#ventanaOrden").removeClass('d-none')
        }, 1500);

        $("#textoOrden").text("Memoriza estas cartas")

        this.secuencia_objetivo.push(Math.floor(Math.random() * (this.cartas.length)))
        this.secuencia_objetivo.push(Math.floor(Math.random() * (this.cartas.length)))

        while (this.secuencia_objetivo[0] == this.secuencia_objetivo[1]) {
            this.secuencia_objetivo[1] = Math.floor(Math.random() * (this.cartas.length))
        }
        this.secuencia_objetivo.push(Math.floor(Math.random() * (this.cartas.length)))
        while (this.secuencia_objetivo[0] == this.secuencia_objetivo[2] || this.secuencia_objetivo[1] == this.secuencia_objetivo[2]) {
            this.secuencia_objetivo[2] = Math.floor(Math.random() * (this.cartas.length))
        }

        this.secuencia_objetivo = this.secuencia_objetivo.slice(0, this.nivel)
        for (var i = 0; i < this.nivel; i++) {
            var nuevaCarta = $("<div class='carta col-lg-4 col-md-4 col-4 d-flex justify-content-around align-items-center' id='" + this.secuencia_objetivo[i] + "' data-valor='" + this.cartas[this.secuencia_objetivo[i]] + "'><img src='/javascripts/assets/" + this.cartas[this.secuencia_objetivo[i]] + ".png' alt='" + this.cartas[this.secuencia_objetivo[i]] + "' class='img-fluid'></div>");
            $("#contenedorCartas").append(nuevaCarta);
        }

        setTimeout(async () => {
            this.mostrarTodas();
        }, 6000);

    }

    mostrarTodas() {
        this.seleccionable = true
        $("#contenedorCartas").empty()
        $("#textoOrden").text("¿Qué cartas han aparecido?")
        for (var i = 0; i < this.cartas.length; i++) {
            var nuevaCarta = $("<div class='carta col-lg-3 col-md-3 col-3 d-flex justify-content-around align-items-center' id='" + this.cartas[i] + "' data-valor='" + i + "' data-seleccionable = 'true'><img src='/javascripts/assets/" + this.cartas[i] + ".png' alt='" + this.cartas[i] + "' class='img-fluid'></div>");
            // Agregamos el nuevo div al contenedor
            $("#contenedorCartas").append(nuevaCarta);
        }

    }



    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    finalizarJuego() {
        $('canvas').css('z-index', '2');
        $('#ventanaOrden').css('z-index', '1');
        $('#ventanaOrden').addClass('d-none')
        const minutos = Math.floor(this.duracion / 60000);
        const segundos = (((this.duracion * 1000) % 60000) / 1000).toFixed(0);

        this.scene.start("scene_fin",
            {
                aciertos: this.puntuacion,
                fallos: this.fallos,
                idJuego: this.idJuego,
                fechaInicio: this.fechaInicio,
                duracion: { minutos, segundos },
                segundos: this.duracion,
                nivel: this.nivel,
                plan: this.plan
            });
    }

}
