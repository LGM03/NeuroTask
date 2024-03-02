export default class scene_refranes extends Phaser.Scene {

    constructor() {
        super({ key: "scene_refranes" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.refranesFaciles = [
            "Más vale tarde que nunca.",
            "El que la sigue, la consigue.",
            "A lo hecho pecho",
            "Cada loco con su tema",
            "De tal palo tal astilla",
            "El que la hace la paga",
            "Dinero llama dinero",
            "No hay mal que por bien no venga."
        ];
        this.refranesMedios = [
            "A caballo regalado no se le mira el dentado.",
            "En boca cerrada no entran moscas.",
            "El que mucho abarca, poco aprieta.",
            "Quien siembra vientos, recoge tempestades.",
            "A mal tiempo, buena cara.",
            "Más vale prevenir que lamentar",
            "A cada cerdo le llega su San Martín.",
            "Al que madruga Dios le ayuda",
        ];
        this.refranesDificiles = [
            "En boca cerrada no entran moscas",
            "Más vale pájaro en mano que ciento volando.",
            "No por mucho madrugar, amanece más temprano",
            "A caballo regalado no le mires el dentado",
            "Al pan, pan, y al vino, vino.",
            "El que mucho corre, pronto para",
            "Mejor solo que mal acompañado"
        ];
        this.casos = []
    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
        this.plan = data.plan

        if (this.plan != null) {
            this.nivel = this.plan.nivel
        }

        switch (this.nivel) {
            case 1:
                this.casos = this.refranesFaciles.concat();
                break;
            case 2:
                this.casos = this.refranesMedios.concat();
                break;
            case 3:
                this.casos = this.refranesDificiles.concat();
                break;
        }
    }

    create() {
        const MS = 1000
        this.duracion = 80  //en segundos
        this.time.delayedCall(this.duracion * MS, this.finalizarJuego, [], this);  //Finaliza el juego pasado el tiempo
        this.crearInterfaz();
        const self = this
        $("#tituloJuego").text("Ordena las palabras y descubre el refrán")

        $(document).on("click", ".botonPalabra", function (event) {
            console.log($(this).text())
            self.fraseFormada.push($(this).text())
            $("#fraseFormada").text($("#fraseFormada").text() + " " + $(this).text())
            $(this).remove()
        })

        $("#btnAceptar").on("click", function (event) {
            if (self.fraseFormada.length != 0 && self.fraseFormada.length == self.solucion.length &&
                self.fraseFormada.every((element, index) => element === self.solucion[index])) {
                self.puntuacion++
                self.cubrirResultado(true)
            } else {
                self.fallos++
                self.cubrirResultado(false)
            }
            $("#contenedorBotones .botonPalabra").remove()
            $("#fraseFormada").text("")
            self.crearInterfaz();
        })

        $("#btnCorregir").on("click", function (event) {
            $("#contenedorBotones .botonPalabra").remove()
            $("#fraseFormada").text("")
            self.fraseFormada = []
            self.arrayDePalabras.forEach((element => {
                var botonPalabra = '<button class="btn botonPalabra rounded bg-white col-lg-3 col-md-3">' + element + '</button>'
                $('#contenedorBotones').append(botonPalabra)
            }))

        })
    }

    cubrirResultado(esAcierto) {
        
        $('canvas').css('z-index', '2');
        $('#juegoLenguaje').css('z-index', '1');
        var color = 0xFF0000
        if (esAcierto) {
            var color = 0x00FF00
        }
        const cover = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, color, 0.5);
        cover.setOrigin(0, 0);

        this.tweens.add({
            targets: cover,
            alpha: 0,
            duration: 1250,
            ease: 'Linear',
            onComplete: () => {
                cover.destroy();
                $('canvas').css('z-index', '1');
                $('#juegoLenguaje').css('z-index', '2');
            }
        });
    }

    crearInterfaz() {
        // Sección de la operación
        console.log(this.casos)
        console.log(this.refran)
        var elegido = Phaser.Math.Between(0, this.casos.length - 1)
        this.refran = this.casos[elegido] //Elijo el refran aleatoriamente
        //Para que no se repitan dos iguales en un mismo juego los elimino al sacarlos
        if (this.casos.length != 1) {
            this.casos.splice(elegido, 1)
        }
        this.solucion = this.refran.split(' ')
        this.arrayDePalabras = this.refran.split(' '); //Desordeno la frase
        this.arrayDePalabras.sort(function () {
            return 0.5 - Math.random();
        });

        const self = this
        this.fraseFormada = []
        $('#juegoLenguaje').removeClass('d-none')
        $('#contenedorBotones').empty()
        this.arrayDePalabras.forEach((element => {
            var botonPalabra = '<button class="btn botonPalabra rounded bg-white col-lg-3 col-md-3">' + element + '</button>'
            $('#contenedorBotones').append(botonPalabra)
        }))
    }



    finalizarJuego() {
        $('canvas').css('z-index', '2');
        $('#juegoLenguaje').css('z-index', '1');
        $('#juegoLenguaje').addClass('d-none')
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



