import Palas from "../gameObjects/palas.js";
export default class scene_pong extends Phaser.Scene {

    constructor() {
        super({ key: "scene_pong" });
        this.fechaInicio = new Date();
    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
        this.plan = data.plan

        if (this.plan != null) {
            this.nivel = this.plan.nivel
        }
    }

    create() {
        const MS = 1000
        this.duracion = 80  //en segundos
        this.time.delayedCall(this.duracion * MS, this.finalizarJuego, [], this);

        this.puntosD = 0;
        this.puntosI = 0;

        let center_width = this.sys.game.config.width / 2;
        let center_height = this.sys.game.config.height / 2;
        let width = this.sys.game.config.width;
        let height = this.sys.game.config.height;

        this.add.image(center_width, center_height, "separador") //imagen de fondo
        var meta = this.add.image(30, center_height, "meta")
        meta.setScale(0.5)

        this.derecha = new Palas(this, center_width * 2 - 30, center_height, "derecha")
        this.derecha.setScale(0.8);

        this.ball = this.physics.add.image(center_width, center_height, "ball")
        this.ball.setVelocityX(500);
        this.ball.setScale(this.sys.game.config.height * 0.2 / this.ball.height);
        this.ball.setBounce(1); //Que rebote a la misma velocidad con la que choco
        this.physics.world.setBoundsCollision(false, false, true, true)//chocques con izq,derecha,arriba,abajo
        this.ball.setCollideWorldBounds(true);

        this.izquierda2 = new Palas(this, width / 4, height / 6, "izquierda") //ok
        this.izquierda2.setScale(0.3);
        this.physics.add.collider(this.ball, this.izquierda2, this.chocaPala, null, this)

        if (this.nivel > 1) {
            this.izquierda3 = new Palas(this, width / 2, height - height / 6, "izquierda") //ok
            this.izquierda3.setScale(0.3);
            this.physics.add.collider(this.ball, this.izquierda3, this.chocaPala, null, this)
        }
        if(this.nivel==3){
            crearTweenParaElemento.call(this, this.izquierda2,this.sys.game.config.height);
            crearTweenParaElemento.call(this, this.izquierda3,this.sys.game.config.height / 6);
        }
        this.physics.add.collider(this.ball, this.derecha, this.chocaPala, null, this)
    }
    

    update(time, delta) {
        if (this.ball.x < 0 || this.ball.x > this.sys.game.config.width) {
            if (this.ball.x < 0) {
                this.puntosI += 1;  // Corregir la variable
              
            } else {
                this.puntosD += 1;  // Corregir la variable
                
            }
            this.ball.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height / 2);
            this.ball.setVelocityX(500)

        }
        // En el método create() o donde configures tus sprites y entradas del usuario
        this.input.on('pointerdown', function (pointer) {
            if (pointer.y < this.derecha.y) {
                console.log(pointer.y + " "+ this.ball.y)
                this.derecha.body.setVelocityY(-300); // Inicia el movimiento hacia arriba
            } else {
                this.derecha.body.setVelocityY(300); // Inicia el movimiento hacia abajo
            }
        }, this);

        this.input.on('pointerup', function (pointer) {
            this.derecha.body.setVelocityY(0); // Detiene el movimiento
        }, this);

    }

    chocaPala() {
        this.ball.setVelocityY(Phaser.Math.Between(-120, 120))
    }


    finalizarJuego() {
        const minutos = Math.floor(this.duracion / 60);
        const segundos = ((this.duracion % 60)).toFixed(0);
        // Por ejemplo, puedes cambiar a otra escena
        this.scene.start("scene_fin",
            {
                aciertos: this.puntosI,
                fallos: this.puntosD,
                idJuego: this.idJuego,
                fechaInicio: this.fechaInicio,
                duracion: { minutos, segundos },
                segundos: this.duracion,
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

