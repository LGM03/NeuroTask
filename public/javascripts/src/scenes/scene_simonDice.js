export default class scene_simonDice extends Phaser.Scene {


    constructor() {
        super({ key: "scene_simonDice" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.rondas = 1;
        this.seleccionable = false
        this.colores = [["moradoApagado", "moradoEncendido"], ["rojoApagado", "rojoEncendido"], ["azulApagado", "azulEncendido"], ["amarilloApagado", "amarilloEncendido"]]
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

        this.fondo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "fondoRosa"); // Cambia la imagen de fondo según tu necesidad
        this.fondo.setScale(0.5);

        // Crear la interfaz de usuario
        this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 8, "Repite el orden en el que se encienden las bombillas", {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5, 0.5)

        this.crearInterfaz();

        this.elaborarSecuencia();

        this.input.on('gameobjectdown', function (pointer, gameObject) {

            if (this.seleccionable) {
                this.seleccionadas.push(gameObject.value)
                this.iluminarBombilla(gameObject.value);
                //Si tienen la misma longitud y todos los elementos son iguales

                console.log(this.seleccionadas + " " + this.secuencia_objetivo)

                setTimeout(async () => {
                    if (this.seleccionadas.length == this.secuencia_objetivo.length) {
                        if (this.seleccionadas.every((element, index) => element == this.secuencia_objetivo[index])) {
                            this.seleccionadas = []
                            this.cubrirResultado(true) //true porque es acierto
                            this.puntuacion++;
                        } else {
                            this.fallos++;
                            this.cubrirResultado(false)
                            this.rondas = 1
                            this.secuencia_objetivo = []
                            this.seleccionadas = []
                        }
                        this.seleccionable = false //ya no se podra seleccionar otra bombilla hasta que no termine de mostrarse la secuencia

                        this.elaborarSecuencia();
                    }
                }, 1250);


            }

        }, this);
    }


    cubrirResultado(esAcierto) {
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
            }
        });
    }


    elaborarSecuencia() {
        //Muestro la secuencia actual

        setTimeout(async () => {

            var mensajeMemoriza = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "memoriza")
            await this.esperar(1500)
            mensajeMemoriza.destroy()

            for (var i = 0; i < this.secuencia_objetivo.length; i++) {
                await this.esperar(1250) //Espero 2 segundos antes de mostrar la siguiente bombilla iluminada 
                this.iluminarBombilla(this.secuencia_objetivo[i]);
            }
            //Agrego un nuevo elemento a la secuencia actual y lo muestro
            
            await this.esperar(1250) //Espero 2 segundos antes de mostrar la siguiente bombilla iluminada 
            for (var i = 0; i < this.nivel; i++) {
                var nuevo = Math.floor(Math.random() * 4)
                this.iluminarBombilla(nuevo);
                await this.esperar(1250)
                this.secuencia_objetivo.push(nuevo)
            }


            var mensajeRepite = this.add.image(this.sys.canvas.width / 2, this.sys.canvas.height / 2, "repite")
            await this.esperar(1500)
            mensajeRepite.destroy()
            this.seleccionable = true
            this.rondas++;

        }, 1250);
    }

    crearInterfaz() {

        this.bombillaGrupo = this.add.group();
        const bombillaMorada = this.add.image(3 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, "moradoApagado", {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScale(0.5);
        bombillaMorada.setInteractive();
        bombillaMorada.value = 0;
        this.bombillaGrupo.add(bombillaMorada)

        const bombillaRoja = this.add.image(5 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, "rojoApagado", {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScale(0.5);
        bombillaRoja.setInteractive();
        bombillaRoja.value = 1;
        this.bombillaGrupo.add(bombillaRoja)

        const bombillaAzul = this.add.image(3 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, "azulApagado", {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScale(0.5);
        bombillaAzul.setInteractive();
        bombillaAzul.value = 2;
        this.bombillaGrupo.add(bombillaAzul)

        const bombillaAmarilla = this.add.image(5 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, "amarilloApagado", {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScale(0.5);
        bombillaAmarilla.setInteractive();
        bombillaAmarilla.value = 3;
        this.bombillaGrupo.add(bombillaAmarilla)

    }

    iluminarBombilla(numeroAleatorio) {

        this.bombillaGrupo.getChildren()[numeroAleatorio].setTexture(this.colores[numeroAleatorio][1]) //La que toque la enciendo
        setTimeout(async () => {// Apaga la bombilla después de la pausa
            this.bombillaGrupo.getChildren()[numeroAleatorio].setTexture(this.colores[numeroAleatorio][0]);
        }, 1000);


    }

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    finalizarJuego() {
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
