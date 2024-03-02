export default class scene_refranes extends Phaser.Scene {

    constructor() {
        super({ key: "scene_anagramas" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.palabrasFacil = [
            "Gato", "Casa", "Sol", "Perro", "Flor",
            "Mesa", "Río", "Tren", "Sol", "Pan",
            "Luna", "Rata", "Sopa", "Vela", "Loro"
        ];
        this.palabrasMedio = [
            "Jardín", "Feliz", "Árbol", "Coche", "Cebra",
            "Casa", "Llaves", "Maleta", "Perros", "Galleta",
            "Avión", "Nariz", "Nubes", "Lápiz", "Goma"
        ];

        this.palabrasDificil = [
            "Elefante", "Universo", "Mariposa", "Elevar", "Cocodrilo",
            "Platillo", "Hospital", "Biblioteca", "Revolución", "Estación",
            "Caminante", "Aventurero", "Descubrimiento", "Conocimiento", "Misterioso"
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
                this.casos = this.palabrasFacil.concat();
                break;
            case 2:
                this.casos = this.palabrasMedio.concat();
                break;
            case 3:
                this.casos = this.palabrasDificil.concat();
                break;
        }
    }

    create() {
        const MS = 1000
        this.duracion = 80  //en segundos
        this.time.delayedCall(this.duracion * MS, this.finalizarJuego, [], this);  //Finaliza el juego pasado el tiempo
        this.crearInterfaz();
        const self = this
        $("#tituloJuego").text("Descubre una palabra con todas estas letras")
        $(document).on("click", ".botonPalabra", function (event) {
            self.fraseFormada += $(this).text()
            $("#fraseFormada").text($("#fraseFormada").text() + " " + $(this).text())
            $(this).remove()
        })

        $("#btnAceptar").on("click", function (event) {
            console.log("dada =" + self.fraseFormada + " solcuon =" + self.refran)
            if (self.fraseFormada.length != 0 &&
                self.refran.includes(self.fraseFormada)) {
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
            self.fraseFormada = ""
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
        var elegido = Phaser.Math.Between(0, this.casos.length - 1)

        this.refran = this.casos[elegido]
       
        //Para que no se repitan dos iguales en un mismo juego los elimino al sacarlos
        if (this.casos.length != 1) {
            this.casos.splice(elegido, 1)
        }

        this.arrayDePalabras = this.refran.split(''); //Desordeno la frase
        this.arrayDePalabras.sort(function () {
            return 0.5 - Math.random();
        });

        const self = this
        this.fraseFormada = ""
        $('#juegoLenguaje').removeClass('d-none')
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



