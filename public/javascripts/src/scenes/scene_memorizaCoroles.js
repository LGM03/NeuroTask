export default class scene_memorizaColores extends Phaser.Scene {


    constructor() {
        super({ key: "scene_memorizaColores" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.seleccionable = false
        this.colores = ["0xFF0000", "0x0000FF", "0x00FF00", "0xFF8000", "0xFFFF00", "0x582900", "0x9C1CF0", "0x000000"]
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

        this.info = this.add.text(4 * this.sys.canvas.width / 8, 1 * this.sys.canvas.height / 8, "Memoriza estas cartas", {
            fontSize: '42px',
            color: '#000',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5)
        this.cobertura=this.add.group()

        this.mostrarTres();

        this.input.on('gameobjectdown', function (pointer, gameObject) {
            if (this.seleccionable) {
                this.seleccionadas.push(gameObject.value)

                const scaleX = gameObject.scaleX;
                const scaleY = gameObject.scaleY;

                this.cobertura.add(this.add.rectangle(gameObject.x, gameObject.y, gameObject.width * scaleX, gameObject.height * scaleY, 0x504C4F, 0.75).setOrigin(0.5, 0.5));
                
                if (this.seleccionadas.length == this.secuencia_objetivo.length) {
                
                    if (this.seleccionadas.every(element =>this.secuencia_objetivo.includes(element))) {
                        this.seleccionadas = []
                        this.secuencia_objetivo = []
                        this.cubrirResultado(true) //true porque es acierto
                        this.puntuacion++;
                    } else {
                        this.fallos++;
                        this.cubrirResultado(false)
                        this.secuencia_objetivo = []
                        this.seleccionadas = []
                    }
                    
                    this.cobertura.clear(true,true)
                    this.coloresGrupo.clear(true,true)
                    this.mostrarTres();
                }
            }

        }, this);
    }


    cubrirResultado(esAcierto) {
        var color = 0xFF0000
        if (esAcierto) {
            var color = 0x00FF00
        }
        const cover = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, color, 0.75);
        cover.setOrigin(0, 0);

        this.tweens.add({
            targets: cover,
            alpha: 0,
            duration: 1500,
            ease: 'Linear',
            onComplete: () => {
                cover.destroy();
            }
        });
    }


    mostrarTres() {
        this.seleccionable = false //ya no se podra seleccionar 
        this.coloresGrupo = this.add.group();

        this.info.setText("Memoriza estos colores")

        this.secuencia_objetivo.push(Math.floor(Math.random() * (this.colores.length)))
        this.secuencia_objetivo.push(Math.floor(Math.random() * (this.colores.length)))

        while (this.secuencia_objetivo[0] == this.secuencia_objetivo[1]) {
            this.secuencia_objetivo[1] = Math.floor(Math.random() * (this.colores.length))
        }
        this.secuencia_objetivo.push(Math.floor(Math.random() * (this.colores.length)))
        while (this.secuencia_objetivo[0] == this.secuencia_objetivo[2] || this.secuencia_objetivo[1] == this.secuencia_objetivo[2]) {
            this.secuencia_objetivo[2] = Math.floor(Math.random() * (this.colores.length))
        }
        this.objetivoGrupo = this.add.group()
        for (var i = 0; i < this.secuencia_objetivo.length; i++) {
            const carta = this.add.rectangle(((i * 2) + 1) * this.sys.canvas.width / 6, 4 * this.sys.canvas.height / 8, 150, 200, this.colores[this.secuencia_objetivo[i]]).setOrigin(0.5)
            carta.setInteractive();
            carta.value = 0;
            this.objetivoGrupo.add(carta)
        }

        setTimeout(async () => {
            this.mostrarTodas();
        }, 3000);

    }

    mostrarTodas() {
        this.seleccionable = true
        this.objetivoGrupo.clear(true,true) //elimino todas la cartas objetivo
        this.coloresGrupo = this.add.group();

        this.info.setText("¿Qué colores han aparecido?")

        const rojo = this.add.rectangle(1 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8,  150, 200, 0xFF0000).setOrigin(0.5);
        rojo.setInteractive();
        rojo.value = 0;
        this.coloresGrupo.add(rojo)

        const azul = this.add.rectangle(3 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, 150, 200, 0x0000FF).setOrigin(0.5);
        azul.setInteractive();
        azul.value = 1;
        this.coloresGrupo.add(azul)

        const verde = this.add.rectangle(5 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, 150, 200, 0x00FF00).setOrigin(0.5);
        verde.setInteractive();
        verde.value = 2;
        this.coloresGrupo.add(verde)

        const naranja = this.add.rectangle(7 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8,150, 200, 0xFF8000).setOrigin(0.5);
        naranja.setInteractive();
        naranja.value = 3;
        this.coloresGrupo.add(naranja)

        const amarillo = this.add.rectangle(1 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8,150, 200, 0xFFFF00).setOrigin(0.5);
        amarillo.setInteractive();
        amarillo.value = 4;
        this.coloresGrupo.add(amarillo)


        const marron = this.add.rectangle(3 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, 150, 200, 0x582900).setOrigin(0.5);
        marron.setInteractive();
        marron.value = 5;
        this.coloresGrupo.add(marron)

        const morado = this.add.rectangle(5 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, 150, 200, 0X9C1CF0).setOrigin(0.5);
        morado.setInteractive();
        morado.value = 6;
        this.coloresGrupo.add(morado)

        const blanco = this.add.rectangle(7 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8,150, 200, 0x000000).setOrigin(0.5);
        blanco.setInteractive();
        blanco.value = 7;
        this.coloresGrupo.add(blanco)

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
                nivel : this.nivel
            });
    }

}
