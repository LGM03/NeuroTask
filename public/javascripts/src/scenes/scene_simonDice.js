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
    }

    create() {
        const MS = 1000
        this.duracion = 20  //en segundos
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

        this.seleccionable = false
        for (var i = 0; i < this.secuencia_objetivo.length; i++) {
            this.mostrarSecuencia( this.secuencia_objetivo[i]);
        }
        var nuevo = Math.floor(Math.random() * 4)
        this.mostrarSecuencia(nuevo);
        this.secuencia_objetivo.push(nuevo)
        this.seleccionable = true
        this.rondas++;

        this.input.on('gameobjectdown', function (pointer, gameObject) {

            if (this.seleccionable) {
                this.mostrarSecuencia( gameObject.value);
            }

        }, this);
    }

    crearInterfaz() {

        this.bombillaGrupo = this.add.group();

        const bombillaMorada = this.add.image(3 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, "moradoApagado", {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScale(0.75);
        bombillaMorada.setInteractive();
        bombillaMorada.value = 0;
        this.bombillaGrupo.add(bombillaMorada)

        const bombillaRoja = this.add.image(5 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, "rojoApagado", {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScale(0.75);
        bombillaRoja.setInteractive();
        bombillaRoja.value = 1;
        this.bombillaGrupo.add(bombillaRoja)

        const bombillaAzul = this.add.image(3 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, "azulApagado", {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScale(0.75);
        bombillaAzul.setInteractive();
        bombillaAzul.value = 2;
        this.bombillaGrupo.add(bombillaAzul)

        const bombillaAmarilla = this.add.image(5 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, "amarilloApagado", {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5).setScale(0.75);
        bombillaAmarilla.setInteractive();
        bombillaAmarilla.value = 3;
        this.bombillaGrupo.add(bombillaAmarilla)

    }

    mostrarSecuencia(numeroAleatorio) {
        this.bombillaGrupo.getChildren()[numeroAleatorio].setTexture(this.colores[numeroAleatorio][1]) //La que toque la enciendo
        setTimeout(async () => {
            // Apaga la bombilla después de la pausa
            this.bombillaGrupo.getChildren()[numeroAleatorio].setTexture(this.colores[numeroAleatorio][0]);
        }, 1000);

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
                duracion: { minutos, segundos }
            });
    }

}
