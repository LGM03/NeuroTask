import Obstaculo from "../gameObjects/obstaculo.js";
export default class scene_pong extends Phaser.Scene {

    constructor() {
        super({ key: "scene_pong" });
        this.fechaInicio = new Date();
    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
        this.plan = data.plan
        this.RONDAS_TOTALES = 6
        this.rondas_actuales=0

        if (this.plan != null) {
            this.nivel = this.plan.nivel
        }
    }

    create() {
        const MS = 1000
        this.fallos = 0;
        this.aciertos = 0;

        let center_width = this.sys.game.config.width / 2;
        let center_height = this.sys.game.config.height / 2;
        let width = this.sys.game.config.width;
        let height = this.sys.game.config.height;

        this.add.image(center_width, center_height, "separador") //imagen de fondo
        var meta = this.add.image(30, center_height, "meta")
        meta.setScale(0.5)

        this.cohete = new Obstaculo(this, center_width * 2 - 30, center_height, "derecha")
        this.cohete.setScale(0.8);

        this.astronauta = this.physics.add.image(center_width, center_height, "ball")
        this.astronauta.setVelocityX(500);
        this.astronauta.setScale(this.sys.game.config.height * 0.2 / this.astronauta.height);
        this.astronauta.setBounce(1); //Que rebote a la misma velocidad con la que choco
        this.physics.world.setBoundsCollision(false, false, true, true)//chocques con izq,derecha,arriba,abajo
        this.astronauta.setCollideWorldBounds(true);

        this.obstaculo2 = new Obstaculo(this, width / 4, height / 6, "izquierda") //ok
        this.obstaculo2.setScale(0.3);
        this.physics.add.collider(this.astronauta, this.obstaculo2, this.chocaPala, null, this)

        if (this.nivel > 1) {
            this.obstaculo3 = new Obstaculo(this, width / 2, height - height / 6, "izquierda") //ok
            this.obstaculo3.setScale(0.3);
            this.physics.add.collider(this.astronauta, this.obstaculo3, this.chocaPala, null, this)
        }
        if(this.nivel==3){
            crearTweenParaElemento.call(this, this.obstaculo2,this.sys.game.config.height);
            crearTweenParaElemento.call(this, this.obstaculo3,this.sys.game.config.height / 6);
        }
        this.physics.add.collider(this.astronauta, this.cohete, this.chocaPala, null, this)
    }
    

    update(time, delta) {
        if (this.astronauta.x < 0 || this.astronauta.x > this.sys.game.config.width) {
            if (this.astronauta.x < 0) {
                this.aciertos += 1;  // Corregir la variable
              
            } else {
                this.fallos += 1;  // Corregir la variable
                
            }
            this.astronauta.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height / 2);
            this.astronauta.setVelocityX(500)
            this.rondas_actuales++;

        }
        // En el método create() o donde configures tus sprites y entradas del usuario
        this.input.on('pointerdown', function (pointer) {
                this.cohete.y =pointer.y
        }, this);

    

        if(this.rondas_actuales==this.RONDAS_TOTALES){
        
            this.finalizarJuego()
        }

    }

    chocaPala() {
        this.astronauta.setVelocityY(Phaser.Math.Between(-120, 120))
    }


    finalizarJuego() {
        var fechaFin = new Date();
        var tiempoTranscurrido = fechaFin - this.fechaInicio
        const minutos = Math.floor(tiempoTranscurrido / 60000);
        const segundos = parseInt(((tiempoTranscurrido % 60000) / 1000).toFixed(0));
        // Por ejemplo, puedes cambiar a otra escena
        this.scene.start("scene_fin",
            {
                aciertos: this.aciertos,
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

function crearTweenParaElemento(elemento, posY) {
    return this.tweens.add({
        targets: elemento,
        y: posY ,  // posición y hacia arriba
        duration: 2000,  // duración del movimiento en milisegundos
        yoyo: true,  // hace que el movimiento sea de ida y vuelta
        repeat: -1,  // para repetir infinitamente
        ease: 'Linear',  // tipo de easing lineal
    });
}

