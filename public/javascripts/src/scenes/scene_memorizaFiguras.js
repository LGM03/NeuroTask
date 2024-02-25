export default class scene_memorizaFiguras extends Phaser.Scene {


    constructor() {
        super({ key: "scene_memorizaFiguras" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.seleccionable = false
        this.cartas = ["corona", "maceta", "paraguas", "tambor", "pera", "melon", "sandia", "mano"]
        this.secuencia_objetivo = []
        this.seleccionadas = []
        
    }


    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
        this.plan = data.plan

        if(this.plan != null){
            this.nivel = this.plan.nivel
        }
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
                    this.cartasGrupo.clear(true,true)
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
        this.cartasGrupo = this.add.group();

        this.info.setText("Memoriza estas cartas")

        this.secuencia_objetivo.push(Math.floor(Math.random() * (this.cartas.length)))
        this.secuencia_objetivo.push(Math.floor(Math.random() * (this.cartas.length)))

        while (this.secuencia_objetivo[0] == this.secuencia_objetivo[1]) {
            this.secuencia_objetivo[1] = Math.floor(Math.random() * (this.cartas.length))
        }
        this.secuencia_objetivo.push(Math.floor(Math.random() * (this.cartas.length)))
        while (this.secuencia_objetivo[0] == this.secuencia_objetivo[2] || this.secuencia_objetivo[1] == this.secuencia_objetivo[2]) {
            this.secuencia_objetivo[2] = Math.floor(Math.random() * (this.cartas.length))
        }
        this.objetivoGrupo = this.add.group()
        for (var i = 0; i < this.secuencia_objetivo.length; i++) {
            const carta = this.add.image(((i * 2) + 1) * this.sys.canvas.width / 6, 4 * this.sys.canvas.height / 8,  this.cartas[this.secuencia_objetivo[i]]).setOrigin(0.5).setScale(0.35);
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
        this.cartasGrupo = this.add.group();

        this.info.setText("¿Qué cartas han aparecido?")
        const corona = this.add.image(1 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, "corona").setOrigin(0.5).setScale(0.25);
        corona.setInteractive();
        corona.value = 0;
        this.cartasGrupo.add(corona)

        const maceta = this.add.image(3 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, "maceta").setOrigin(0.5).setScale(0.25);
        maceta.setInteractive();
        maceta.value = 1;
        this.cartasGrupo.add(maceta)

        const paraguas = this.add.image(5 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, "paraguas").setOrigin(0.5).setScale(0.25);
        paraguas.setInteractive();
        paraguas.value = 2;
        this.cartasGrupo.add(paraguas)

        const tambor = this.add.image(7 * this.sys.canvas.width / 8, 6 * this.sys.canvas.height / 8, "tambor").setOrigin(0.5).setScale(0.25);
        tambor.setInteractive();
        tambor.value = 3;
        this.cartasGrupo.add(tambor)

        const pera = this.add.image(1 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, "pera").setOrigin(0.5).setScale(0.25);
        pera.setInteractive();
        pera.value = 4;
        this.cartasGrupo.add(pera)

        const melon = this.add.image(3 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, "melon").setOrigin(0.5).setScale(0.25);
        melon.setInteractive();
        melon.value = 5;
        this.cartasGrupo.add(melon)

        const sandia = this.add.image(5 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, "sandia").setOrigin(0.5).setScale(0.25);
        sandia.setInteractive();
        sandia.value = 6;
        this.cartasGrupo.add(sandia)

        const mano = this.add.image(7 * this.sys.canvas.width / 8, 3 * this.sys.canvas.height / 8, "mano").setOrigin(0.5).setScale(0.25);
        mano.setInteractive();
        mano.value = 7;
        this.cartasGrupo.add(mano)

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
