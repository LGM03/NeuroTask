export default class scene_anagramas extends Phaser.Scene {

    constructor() {
        super({ key: "scene_anagramas" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.tiempoCategoria = 3
        this.MS = 1000
        this.RONDAS_TOTALES = 6 //Numero de rondas que se van a jugar 
        this.rondas_actuales = 0
        //Batería de casos, divididos por tipo y dificultad 
        this.ejercicios = [
            {
                "Países": [
                    ["España", "Francia", "Italia", "Brasil", "China", "México", "Canadá", "Alemania"],
                    ["Japón", "Austria", "Rusia", "India", "Corea", "Egipto", "Suecia", "Argentina", "Sudáfrica", "Australia"],
                    ["Suiza", "Noruega", "Estonia", "Singapur", "Portugal", "Malasia", "Letonia", "Islandia", "Chile"]
                ]
            },
            {
                "Animales": [
                    ["Gato", "Perro", "Pato", "Pez", "Oso", "Ratón", "Loro", "Conejo", "Caballo", "Vaca"],
                    ["Tigre", "León", "Cebra", "Jirafa", "Hámster", "Gorila", "Canguro", "Zorro", "Serpiente", "Mono"],
                    ["Pájaro", "Delfín", "Salmón", "Elefante", "Cangrejo", "Sardina", "Búho", "Rinoceronte", "Hipopótamo", "Chimpancé"]
                ]
            },
            {
                "Colores": [
                    ["Rojo", "Azul", "Verde", "Amarillo", "Blanco", "Negro", "Morado", "Gris", "Rosa", "Naranja"],
                    ["Violeta", "Marrón", "Turquesa", "Dorado", "Plateado", "Índigo", "Ámbar", "Cian", "Carmesí", "Rubí"],
                    ["Lavanda", "Beige", "Esmeralda", "Teal", "Magenta", "Marfil", "Cobalto", "Óxido", "Celeste", "Terciopelo"]
                ]
            }

        ]

        this.casos = []

    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
        this.plan = data.plan

        if (this.plan != null) { //Si forma parte de un plan recojo su nivel
            this.nivel = this.plan.nivel
        }

        //Escojo los casos segun categoria aleatoria y nivel
        const categoriaAleatoria = this.ejercicios[Math.floor(Math.random() * this.ejercicios.length)];
        $("#tematica").text(Object.keys(categoriaAleatoria)[0])
        $("#tematicaInicial").text(Object.keys(categoriaAleatoria)[0])
        this.casos = categoriaAleatoria[Object.keys(categoriaAleatoria)[0]][this.nivel - 1].concat();
    }

    async create() {
        //Creo toda la vista con JQUERY en un div
        $('#divTematicaLenguaje').removeClass('d-none')
        await this.esperar(this.MS * this.tiempoCategoria)
        $('#juegoLenguaje').removeClass('d-none')
        $('#divTematicaLenguaje').addClass('d-none')
        this.crearInterfaz();
        const self = this
        $("#tituloJuego").text("Descubre una palabra con todas estas letras")

        //Cuando de click a una letra 
        $(document).on("click", ".botonPalabra", function (event) {
            self.fraseFormada += $(this).text()
            $("#fraseFormada").text($("#fraseFormada").text() + "" + $(this).text())
            $(this).remove()

            //Si la longitud que tengo es la de la solucion compruebo automaticamente
            if (self.fraseFormada.length == self.solucion.length) {
                if (self.solucion == self.fraseFormada) { //Si la solucion es la adecuada aumento puntuacion
                    self.puntuacion++
                    self.cubrirResultado(true)
                } else { //Si la solucion es fallida aumento cantida de fallos 
                    self.fallos++
                    self.cubrirResultado(false)
                }
                self.rondas_actuales++; //acierte o falle aumento rondas totales
                self.time.delayedCall(500, self.siguienteRonda, [], self);  //Espero 500ms antes de pasar a la siguiente ronda
            
            }

        })

        //Al pulsar el boton corregir se retorna una letra a su sitio original
        $("#btnCorregir").on("click", function (event) { 
            var palabraFormada = $("#fraseFormada").text()
            if (palabraFormada.length > 0) {
                var letra = palabraFormada.charAt(palabraFormada.length - 1);
                $("#fraseFormada").text(palabraFormada.slice(0, -1)) //Quito una letra del texto de solucion
                self.fraseFormada = self.fraseFormada.slice(0, -1)
                var botonPalabra = '<button class="btn botonPalabra rounded bg-white col-lg-3 col-md-3">' + letra + '</button>'
                $('#contenedorBotones').append(botonPalabra)
            }
        })
    }

    //En caso de acierto o fallo cubro temporalmente la pantalla con una imagen
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

    //Para pasar a la siguiente ronda, borro los divs que hay y los genero de nuevo
    siguienteRonda(){
        $("#contenedorBotones .botonPalabra").remove()
        $("#fraseFormada").text("")
        this.crearInterfaz();
    }

    async crearInterfaz() {
        // Sección de la operación
        var elegido = Phaser.Math.Between(0, this.casos.length - 1)

        this.solucion = this.casos[elegido]

        //Para que no se repitan dos iguales en un mismo juego los elimino al sacarlos
        if (this.casos.length != 1) {
            this.casos.splice(elegido, 1)
        }

        this.arrayDePalabras = this.solucion.split(''); //Desordeno la frase
        this.arrayDePalabras.sort(function () {
            return 0.5 - Math.random();
        });

        this.fraseFormada = ""
       
        $('#juegoLenguaje').removeClass('d-none')
        this.arrayDePalabras.forEach((element => { //Creo un boton por cada letra 
            var botonPalabra = '<button class="btn botonPalabra rounded bg-white col-lg-3 col-md-3">' + element + '</button>'
            $('#contenedorBotones').append(botonPalabra)
        }))

    }

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async update(){ //Si he terminado todas las rondas llamo a la funcion de final
        if(this.rondas_actuales==this.RONDAS_TOTALES){
            await this.esperar(400)
            this.finalizarJuego()
        }
    }
    
    
    //Funcion final de juego, llama a escena final, le pasa los datos que corresponden
    finalizarJuego() {
        $('canvas').css('z-index', '2');
        $('#juegoLenguaje').css('z-index', '1');
        $('#juegoLenguaje').addClass('d-none')
        var fechaFin = new Date();
        var tiempoTranscurrido = fechaFin - this.fechaInicio
        const minutos = Math.floor(tiempoTranscurrido / 60000);
        const segundos = parseInt(((tiempoTranscurrido % 60000) / 1000).toFixed(0));

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



