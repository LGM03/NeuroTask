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
        this.RONDAS_TOTALES = 6
        this.rondas_actuales=0
        
    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
        this.plan = data.plan

        if(this.plan != null){
            this.nivel = this.plan.nivel
        }

        switch (this.nivel) {
            case 1:  //dificultad facil juega solo con 4 cartas
                this.colores = this.colores.slice(0, 4)
                break;
            case 2://dificultad media juega solo con 6 cartas
                this.colores = this.colores.slice(0, 6)
                break;
            //dificultad dificil juega con todas
        }
    }

    create() {
        const MS = 1000

        this.fondo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "fondoRosa"); // Cambia la imagen de fondo según tu necesidad
        this.fondo.setScale(0.5);

        this.info = this.add.text(4 * this.sys.canvas.width / 8, 1 * this.sys.canvas.height / 8, "Memoriza estos colores", {
            fontSize: '42px',
            color: '#000',
            fontFamily: 'Arial',
            fontStyle: 'bold'
        }).setOrigin(0.5, 0.5)
        this.cobertura=this.add.group()
        //Muestro las cartas que se deben memorizar
        this.mostrarTres();
        //Cuanndo se pulse una carta
        this.input.on('gameobjectdown', async function (pointer, gameObject) {
            if (this.seleccionable) {
                this.seleccionadas.push(gameObject.value)

                const scaleX = gameObject.scaleX;
                const scaleY = gameObject.scaleY;
                //Cubro la carta como seleccionada 
                this.cobertura.add(this.add.rectangle(gameObject.x, gameObject.y, gameObject.width * scaleX, gameObject.height * scaleY, 0xFFFFFF, 0.75).setOrigin(0.5, 0.5));
                //Si se han pulsado la cantidad de cartas esperadas en la solucion
                if (this.seleccionadas.length == this.secuencia_objetivo.length) {
                    //Compruebo que se hayan pulsado las cartas apropiadas
                    if (this.seleccionadas.every(element =>this.secuencia_objetivo.includes(element))) {
                        this.seleccionadas = []
                        this.secuencia_objetivo = []
                        this.cubrirResultado(true) //true porque es acierto
                        await this.esperar(750)
                        this.puntuacion++;
                    } else {//si hay fallo cubro con mensaje de error
                        this.fallos++;
                        this.cubrirResultado(false)
                        await this.esperar(750)
                        this.secuencia_objetivo = []
                        this.seleccionadas = []
                    }
                    
                    this.rondas_actuales++;
                    this.cobertura.clear(true,true)
                    this.coloresGrupo.clear(true,true)
                    this.mostrarTres();
                }
            }
        }, this);
    }

    cubrirResultado(esAcierto) { //Cubro con acierto o fallo

        var imagen = "fallo"
        if (esAcierto) {
            imagen = "acierto"
        }
        var cover = this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, imagen).setScale(0.4).setOrigin(0.5, 0.5)//imagen de fondo
        this.tweens.add({
            targets: cover,
            alpha: 0,
            duration: 750,
            delay:250,
            ease: 'Linear',
            onComplete: () => {
                cover.destroy();
            }
        });
    }

    async mostrarTres() { //Muestro las cartas que se deben recordar
        this.seleccionable = false //ya no se podra seleccionar 
        this.coloresGrupo = this.add.group();

        var mensajeMemoriza = this.add.image(this.sys.canvas.width/2, this.sys.canvas.height/2,"memoriza")
        await this.esperar(1500) 
        mensajeMemoriza.destroy()

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
        this.secuencia_objetivo = this.secuencia_objetivo.slice(0, this.nivel)
        for (var i = 0; i < this.secuencia_objetivo.length; i++) {
            const carta = this.add.rectangle(((i * 2) + 1) * this.sys.canvas.width / 6, 4 * this.sys.canvas.height / 8, 200, 250, this.colores[this.secuencia_objetivo[i]]).setOrigin(0.5).setStrokeStyle(4, 0x888888);
            carta.setInteractive();
            carta.value = 0;
            this.objetivoGrupo.add(carta)
        }

        setTimeout(async () => { //Pasado el tiempo necesario muestro todas para que el usuario elija
            this.mostrarTodas();
        }, 3000);

    }
    //Mostrar todas las cartas 
    mostrarTodas() {
        this.seleccionable = true
        this.objetivoGrupo.clear(true,true) //elimino todas la cartas objetivo
        this.coloresGrupo = this.add.group();

        this.info.setText("¿Qué colores han aparecido?")

        const rojo = this.add.rectangle(1 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8,  200, 250, 0xFF0000).setOrigin(0.5).setStrokeStyle(4, 0x888888);;
        rojo.setInteractive();
        rojo.value = 0;
        this.coloresGrupo.add(rojo)

        const azul = this.add.rectangle(3 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, 200, 250, 0x0000FF).setOrigin(0.5).setStrokeStyle(4, 0x888888);;
        azul.setInteractive();
        azul.value = 1;
        this.coloresGrupo.add(azul)

        const verde = this.add.rectangle(5 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, 200, 250, 0x00FF00).setOrigin(0.5).setStrokeStyle(4, 0x888888);;
        verde.setInteractive();
        verde.value = 2;
        this.coloresGrupo.add(verde)

        const naranja = this.add.rectangle(7 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8,200, 250, 0xFF8000).setOrigin(0.5).setStrokeStyle(4, 0x888888);;
        naranja.setInteractive();
        naranja.value = 3;
        this.coloresGrupo.add(naranja)

        const amarillo = this.add.rectangle(1 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8,200, 250, 0xFFFF00).setOrigin(0.5).setStrokeStyle(4, 0x888888);;
        amarillo.setInteractive();
        amarillo.value = 4;
        this.coloresGrupo.add(amarillo)

        const marron = this.add.rectangle(3 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, 200, 250, 0x582900).setOrigin(0.5).setStrokeStyle(4, 0x888888);;
        marron.setInteractive();
        marron.value = 5;
        this.coloresGrupo.add(marron)

        const morado = this.add.rectangle(5 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, 200, 250, 0X9C1CF0).setOrigin(0.5).setStrokeStyle(4, 0x888888);;
        morado.setInteractive();
        morado.value = 6;
        this.coloresGrupo.add(morado)

        const blanco = this.add.rectangle(7 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8,200, 250, 0x000000).setOrigin(0.5).setStrokeStyle(4, 0x888888);;
        blanco.setInteractive();
        blanco.value = 7;
        this.coloresGrupo.add(blanco)

    }


    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async update(){
        if(this.rondas_actuales==this.RONDAS_TOTALES){
            await this.esperar(900)
            this.finalizarJuego()
        }
    }
    //Logica para llamar a la escena final pasando aciertos, fallos y tiempo invertido.
    finalizarJuego() {
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
