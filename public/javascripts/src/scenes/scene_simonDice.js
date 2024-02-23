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
    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
    }

    create() {

        const MS = 1000
        this.duracion = 80  //en segundos
        this.time.delayedCall(this.duracion * MS, this.finalizarJuego, [], this);  //Finaliza el juego pasado el tiempo

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
                    console.log(self.secuencia_objetivo + " ----  " + self.seleccionadas)
                    self.seleccionable = false
                    if (self.seleccionadas.every((element, index) => element == self.secuencia_objetivo[index])) {
                        console.log("A")
                        self.seleccionadas = []
                        self.cubrirResultado(true) //true porque es acierto
                        self.puntuacion++;
                    } else {
                        console.log("F")
                        self.fallos++;
                        self.cubrirResultado(false)
                        self.rondas = 1
                        self.secuencia_objetivo = []
                        self.seleccionadas = []
                    }
                    //ya no se podra seleccionar otra bombilla hasta que no termine de mostrarse la secuencia
                    self.elaborarSecuencia();
                } else if (self.seleccionadas.length > self.secuencia_objetivo.length) {
                    self.fallos++;
                    self.cubrirResultado(false)
                    self.rondas = 1
                    self.secuencia_objetivo = []
                    self.seleccionadas = []
                    self.elaborarSecuencia();
                }

            }
        })
    }

    cubrirResultado(esAcierto) {
        $('#ventanaSimonDice').addClass('d-none')
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
                $('#ventanaSimonDice').removeClass('d-none')
                cover.destroy();
            }
        });
    }

    elaborarSecuencia() {
        //Muestro la secuencia actual

        setTimeout(async () => {

            $('#ventanaSimonDice').addClass('d-none')
            var mensajeMemoriza = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "memoriza")
            await this.esperar(1500)
            mensajeMemoriza.destroy()
            $('#ventanaSimonDice').removeClass('d-none')
            await this.esperar(500)

            for (var i = 0; i < this.secuencia_objetivo.length; i++) {
                console.log(this.secuencia_objetivo[i])
                //Espero 2 segundos antes de mostrar la siguiente bombilla iluminada 
                $("#" + this.secuencia_objetivo[i]).removeClass("sombra");
                await this.esperar(1000)
                $("#" + this.secuencia_objetivo[i]).addClass("sombra");
                await this.esperar(1000)
            }
            //Agrego un nuevo elemento a la secuencia actual y lo muestro

            for (var i = 0; i < this.nivel; i++) {
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
        $('#ventanaSimonDice').addClass('d-none')
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
                nivel: this.nivel
            });
    }

}
