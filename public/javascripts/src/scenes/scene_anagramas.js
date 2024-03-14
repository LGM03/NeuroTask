export default class scene_refranes extends Phaser.Scene {

    constructor() {
        super({ key: "scene_anagramas" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();

        this.ejercicios = [
            {
                "Países": [
                    ["España", "Francia", "Italia", "Brasil", "China", "México", "Canadá"],
                    ["Japón", "Austria", "Rusia", "India", "Corea", "Egipto","Suecia"],
                    ["Suiza","Noruega", "Estonia", "Singapur", "Portugal", "Malasia", "Letonia"]
                ]
            },
            {
                "Animales": [
                    ["Gato", "Perro", "Pato", "Pez", "Oso", "Ratón", "Loro", "Conejo"],
                    ["Tigre", "León", "Cebra", "Jirafa", "Hámster", "Gorila", "Canguro"],
                    ["Pájaro", "Delfín", "Salmón","Elefante", "Cangrejo","Sardina"]
                ]
            },
            {
                "Colores": [
                    ["Rojo", "Azul", "Verde", "Amarillo", "Blanco", "Negro", "Morado", "Gris"],
                    ["Naranja", "Violeta", "Marrón", "Rosa", "Turquesa", "Dorado", "Plateado"],
                    ["Índigo", "Ámbar", "Cian", "Lavanda", "Carmesí", "Rubí", "Beige"]
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
            console.log(self.fraseFormada)
            console.log(self.refran)
            if (self.fraseFormada.length != 0 &&
                self.refran == self.fraseFormada) {
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
            var palabraFormada = $("#fraseFormada").text()
            if(palabraFormada.length>1){
                var letra = palabraFormada.charAt(palabraFormada.length - 1);
                $("#fraseFormada").text(palabraFormada.slice(0, -1)) //Quito una letra del texto de solucion
                self.fraseFormada = self.fraseFormada.slice(0,-1)
                var botonPalabra = '<button class="btn botonPalabra rounded bg-white col-lg-3 col-md-3">' + letra + '</button>'
                $('#contenedorBotones').append(botonPalabra)
                
            }

        })
    }

    cubrirResultado(esAcierto) {
        $('canvas').css('z-index', '2');
        $('#juegoLenguaje').css('z-index', '1');
 
        var imagen = "fallo"
        if (esAcierto) {
            imagen = "acierto"
        }
        var cover = this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, imagen).setScale(0.4).setOrigin(0.5, 0.5)//imagen de fondo


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
        const minutos = Math.floor(this.duracion / 60);
        const segundos = (this.duracion % 60).toFixed(0);
        console.log(this.duracion + " " +minutos+ " "+segundos)
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



