export default class scene_refranes extends Phaser.Scene {

    constructor() {
        super({ key: "scene_anagramas" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();

        this.ejercicios = [
            {
                "Países": [
                    ["España", "Francia", "Italia", "Brasil", "China", "México", "Argentina", "Canadá"],
                    ["Alemania", "Japón", "Australia", "Rusia", "India", "Sudáfrica", "Corea", "Egipto"],
                    ["Suiza", "Dinamarca", "Noruega", "Finlandia", "Singapur", "Portugal", "Malasia", "Indonesia"]
                ]
            },
            {
                "Trabajos": [
                    ["Médico", "Profesor", "Bombero", "Abogado", "Carpintero", "Piloto", "Cocinero", "Enfermero"],
                    ["Ingeniero", "Arquitecto", "Periodista", "Diseñador", "Electricista", "Psicólogo", "Mecánico", "Fontanero"],
                    ["Biólogo", "Astrónomo", "Geólogo", "Economista", "Fotógrafo", "Filósofo", "Antropólogo", "Etnólogo"]
                ]
            },
            {
                "Animales": [
                    ["Gato", "Perro", "Pato", "Pez", "Oso", "Ratón", "Loro", "Conejo"],
                    ["Tigre", "León", "Elefante", "Cebra", "Jirafa", "Hámster", "Gorila", "Canguro"],
                    ["Ornitorrinco", "Hipopótamo", "Pangolín", "Quetzal", "Cangrejo", "Narval", "Suricata", "Tapir"]
                ]
            },
            {
                "Frutas": [
                    ["Manzana", "Pera", "Uva", "Kiwi", "Mango", "Plátano", "Fresa", "Piña"],
                    ["Frambuesa", "Sandía", "Melocotón", "Granada", "Ciruela", "Naranja", "Limón", "Mandarina"],
                    ["Níspero", "Carambola", "Rambután", "Mangostán", "Maracuyá", "Pitahaya", "Lichi", "Guayaba"]
                ]
            },
            {
                "Colores": [
                    ["Rojo", "Azul", "Verde", "Amarillo", "Blanco", "Negro", "Morado", "Gris"],
                    ["Naranja", "Violeta", "Marrón", "Rosa", "Turquesa", "Dorado", "Plateado", "Beige"],
                    ["Índigo", "Esmeralda", "Ámbar", "Cian", "Lavanda", "Carmesí", "Rubí", "Topacio"]
                ]
            }
        ]


        this.casos = []

    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
        this.plan = data.plan

        if (this.plan != null) {
            this.nivel = this.plan.nivel
        }

        const categoriaAleatoria = this.ejercicios[Math.floor(Math.random() *  this.ejercicios.length)];
        $("#tematica").text(Object.keys(categoriaAleatoria)[0])
        this.casos = categoriaAleatoria[Object.keys(categoriaAleatoria)[0]][this.nivel-1].concat();
        console.log(this.casos)
       
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



