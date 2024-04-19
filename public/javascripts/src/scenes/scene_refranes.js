export default class scene_refranes extends Phaser.Scene {

    constructor() {
        super({ key: "scene_refranes" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.RONDAS_TOTALES = 6
        this.rondas_actuales = 0
        this.refranesFaciles = [
            "Más vale tarde que nunca.",
            "El que la sigue, la consigue.",
            "A lo hecho pecho.",
            "Cada loco con su tema.",
            "De tal palo tal astilla.",
            "El que la hace la paga.",
            "Dinero llama dinero.",
            "No hay mal que por bien no venga.",
            "A mal tiempo, buena cara.",
            "Más vale prevenir que lamentar.",
            "A quien madruga, Dios lo ayuda.",
            "En boca cerrada no entran moscas.",
            "Cría cuervos y te sacarán los ojos.",
            "El amor todo lo puede.",
            "Perro ladrador poco mordedor."
        ];
        
        this.refranesMedios = [
            "A caballo regalado no le mires el dentado.",
            "Quien siembra vientos, recoge tempestades.",
            "A cada cerdo le llega su San Martín.",
            "Al que madruga, Dios lo ayuda.",
            "Más vale pájaro en mano que ciento volando.",
            "El que mucho abarca, poco aprieta.",
            "Camarón que se duerme, se lo lleva la corriente.",
            "El que mucho corre, pronto para.",
            "Mejor solo que mal acompañado.",
            "Más vale prevenir que lamentar.",
            "Quien mal anda, mal acaba.",
            "Más vale perder el tiempo que perder la vida.",
            "No hay peor ciego que el que no quiere ver."
        ];
        
        this.refranesDificiles = [
            "No por mucho madrugar, amanece más temprano.",
            "Al pan, pan, y al vino, vino.",
            "Perro que ladra, mordió antes.",
            "Camarón que se duerme, se lo lleva la corriente.",
            "En boca cerrada no entran moscas.",
            "Más vale tarde que nunca.",
            "El amor todo lo puede.",
            "Quien mucho abarca, poco aprieta.",
            "A donde fueres, haz lo que vieres.",
            "El que mucho corre, pronto para.",
            "Más vale perder un minuto en la vida que la vida en un minuto.",
            "La avaricia rompe el saco.",
            "La envidia es como el cáncer que carcome por dentro.",
            "En boca cerrada no entran moscas, pero no sale la verdad."
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
        this.crearInterfaz();
        const self = this
        $("#tituloJuego").text("Ordena las palabras y descubre el refrán")

        $(document).on("click", ".botonPalabra", function (event) {
            self.fraseFormada.push($(this).text())
            $("#fraseFormada").text($("#fraseFormada").text() + " " + $(this).text())
            $(this).remove()

            if (self.fraseFormada.length == self.solucion.length) {
                if (self.fraseFormada.every((element, index) => element === self.solucion[index])) {
                    self.puntuacion++
                    self.cubrirResultado(true)
                } else {
                    self.fallos++
                    self.cubrirResultado(false)
                }
                self.rondas_actuales++;
                self.time.delayedCall(500, self.siguienteRonda, [], self); 
            
            }
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

    siguienteRonda(){
        $("#contenedorBotones .botonPalabra").remove()
        $("#fraseFormada").text("")
        this.crearInterfaz();
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

    async update(){
        if(this.rondas_actuales==this.RONDAS_TOTALES){
            await this.esperar(400)
            this.finalizarJuego()
        }
    }

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


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



