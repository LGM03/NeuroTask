export default class scene_simonDice extends Phaser.Scene {


    constructor() {
        super({ key: "scene_simonDice" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.rondas = 1;
        this.seleccionable = false
        this.colores = ["bombillaMorada", "bombillaRoja", "bombillaAzul", "bombillaAmarilla"]
        this.secuencia_objetivo = []
        this.seleccionadas = []
        this.esFallo = false
        this.rondas_actuales = 0
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
                this.RONDAS_TOTALES = 4
                break;
            case 2:
                this.RONDAS_TOTALES = 6
                break;
            case 3:
                this.RONDAS_TOTALES = 8
                break;
        }
    }

    create() {

        const MS = 1000

        $('#ventanaSimonDice').removeClass('d-none')
        const self = this
        // Asignar un evento de clic al botón

        this.elaborarSecuencia();

        $('#ventanaSimonDice').on("click", ".bombilla", async function (event) {
            if (self.seleccionable) {
                self.seleccionadas.push($(this).attr("id"))
                $(this).removeClass("sombra")
                await self.esperar(1000)
                $(this).addClass("sombra")
                //Si tienen la misma longitud y todos los elementos son iguales
                await self.esperar(1000)
                if (self.seleccionadas.length == self.secuencia_objetivo.length && self.secuencia_objetivo.length >= 1) {
                    self.seleccionable = false
                    if (self.seleccionadas.every((element, index) => element == self.secuencia_objetivo[index])) {
                        self.seleccionadas = []
                        self.cubrirResultado(true) //true porque es acierto
                        self.puntuacion++;
                        self.esFallo = false
                    } else {
                        self.fallos++;
                        self.esFallo = true
                        self.cubrirResultado(false)
                        self.seleccionadas = []
                    }
                    //ya no se podra seleccionar otra bombilla hasta que no termine de mostrarse la secuencia
                    self.elaborarSecuencia();
                    self.rondas_actuales++;
                } else if (self.seleccionadas.length > self.secuencia_objetivo.length) {
                    self.fallos++;
                    self.cubrirResultado(false)
                    self.esFallo = true
                    self.seleccionadas = []
                    self.elaborarSecuencia();
                    self.rondas_actuales++;
                }

            }
        })
    }

    async update() {
        if (this.rondas_actuales == this.RONDAS_TOTALES) {
            await this.esperar(900)
            this.finalizarJuego()
        }
    }

    cubrirResultado(esAcierto) {
        $('canvas').css('z-index', '2');
        $('#ventanaSimonDice').css('z-index', '1');

        var imagen = "fallo"
        if (esAcierto) {
            imagen = "acierto"
        }
        var cover = this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, imagen).setScale(0.4).setOrigin(0.5, 0.5)//imagen de fondo

        this.tweens.add({
            targets: cover,
            alpha: 0,
            duration: 1400,
            ease: 'Linear',
            onComplete: () => {
                cover.destroy();
                $('canvas').css('z-index', '1');
                $('#ventanaSimonDice').css('z-index', '2');
            }
        });
    }

    elaborarSecuencia() {
        //Muestro la secuencia actual

        this.timeoutElaborarSec = setTimeout(async () => {

            $('#ventanaSimonDice').addClass('d-none')
            var mensajeMemoriza = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "memoriza")
            await this.esperar(1500)
            mensajeMemoriza.destroy()
            $('#ventanaSimonDice').removeClass('d-none')
            await this.esperar(500)

            for (var i = 0; i < this.secuencia_objetivo.length; i++) {
                //Espero 2 segundos antes de mostrar la siguiente bombilla iluminada 
                $("#" + this.secuencia_objetivo[i]).removeClass("sombra");
                await this.esperar(1000)
                $("#" + this.secuencia_objetivo[i]).addClass("sombra");
                await this.esperar(1000)
            }
            //Agrego un nuevo elemento a la secuencia actual y lo muestro
            if (!this.esFallo) {
                var nuevo = Math.floor(Math.random() * 4)
                $("#" + this.colores[nuevo]).removeClass("sombra");
                await this.esperar(1000)
                $("#" + this.colores[nuevo]).addClass("sombra");
                this.secuencia_objetivo.push(this.colores[nuevo])
                await this.esperar(1000)
            }

            $('#ventanaSimonDice').addClass('d-none')
            var mensajeRepite = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "repite")
            await this.esperar(1500)
            mensajeRepite.destroy()
            $('#ventanaSimonDice').removeClass('d-none')
            this.seleccionable = true
            this.rondas++;

        }, 1250);
    }

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    finalizarJuego() {
        clearTimeout(this.timeoutElaborarSec);
        $('canvas').css('z-index', '2');
        $('#ventanaSimonDice').css('z-index', '1');
        $('#ventanaSimonDice').addClass("d-none")
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
