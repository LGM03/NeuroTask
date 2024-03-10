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
        //Marca el final de la partida, en tiempo, 2 Minutos medidos en ms (120 000)

        //Puesto a 10.000 ms para pruebas (10s)
        this.duracion = 80  //en segundos
        this.time.delayedCall(this.duracion * MS, this.finalizarJuego, [], this);


        this.puntosD = 0;
        this.puntosI = 0;

        let center_width = this.sys.game.config.width / 2;

        let center_height = this.sys.game.config.height / 2;
        let width = this.sys.game.config.width;
        let height = this.sys.game.config.height;

        this.add.text(center_width - 5, 15, "-", {
            color: '#000000'
        });
        this.puntosDerecha = this.add.text(center_width - 25, 15, this.puntosD, {
            color: '#000000'
        });
        this.puntosIzquierda = this.add.text(center_width + 15, 15, this.puntosI, {
            color: '#000000'
        });

        this.add.image(center_width, center_height, "separador") //imagen de fondo
        var meta = this.add.image(30, center_height, "meta")
        meta.setScale(0.5)

        const canvasHeight = this.sys.game.config.height;

        this.izquierda2 = new Palas(this, width / 4, height / 6, "izquierda") //ok

        this.izquierda2.setScale(0.3);


        this.derecha = new Palas(this, center_width * 2 - 30, center_height, "derecha")

        this.derecha.setScale(0.8);

        this.ball = this.physics.add.image(center_width, center_height, "ball")
        this.ball.setVelocityX(350);

        //#######
        this.ball.setScale(canvasHeight * 0.2 / this.ball.height);


        this.ball.setBounce(1); //Que rebote a la misma velocidad con la que choco
        this.physics.world.setBoundsCollision(false, false, true, true)//chocques con izq,derecha,arriba,abajo
        this.ball.setCollideWorldBounds(true);

        if (this.nivel > 1) {
            this.izquierda3 = new Palas(this, width / 2, height - height / 6, "izquierda") //ok
            this.izquierda3.setScale(0.3);
            this.physics.add.collider(this.ball, this.izquierda3, this.chocaPala, null, this)
        }


        this.physics.add.collider(this.ball, this.izquierda2, this.chocaPala, null, this)
        this.physics.add.collider(this.ball, this.derecha, this.chocaPala, null, this)


        this.cursor = this.input.keyboard.createCursorKeys(); //crea en el atributo las flechitas


    }

    update(time, delta) {
        if (this.ball.x < 0 || this.ball.x > this.sys.game.config.width) {
            if (this.ball.x < 0) {
                this.puntosI += 1;  // Corregir la variable
                this.puntosIzquierda.setText(this.puntosI);

            } else {
                this.puntosD += 1;  // Corregir la variable
                this.puntosDerecha.setText(this.puntosD);  // Corregir la variable
            }
            this.ball.setPosition(this.sys.game.config.width / 2, this.sys.game.config.height / 2);
            this.ball.setVelocityX(350)

        }
        // En el método create() o donde configures tus sprites y entradas del usuario
        this.input.on('pointerdown', function (pointer) {
            if (pointer.y < this.sys.canvas.height / 2) {
                console.log("arriba")
                this.derecha.body.setVelocityY(-300); // Inicia el movimiento hacia arriba
            } else {
                console.log("abajo")
                this.derecha.body.setVelocityY(300); // Inicia el movimiento hacia abajo
            }
        }, this);

        this.input.on('pointerup', function (pointer) {
            console.log("Up")
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


/*OPERACIONES VARIAS CON ESCENAS:
    this.scene.bringToTop(z ) -> Mueve la escena z delante del todo
    this.scene.sendToBack(z) -> Mueve la escena z atrás del todo
    this.scene.moveUp(z) -> Mueve la escena z una posicion hacia delante
    this.scene.moveDown(z) ->Mueve la escena z una posicion hacia atras
    this.scene.moveAbove(z,w) -> Mueve la escena w encima de una escena  z indicada
    this.scene.moveBelow(z,w) -> Mueve la escena  w detras de una escena z indicada 
*/


/*estilos del tecxto 
        color : 'HEX'
        backgroundColor : 'HEX'
        fontSize : px
        padding:{
            top:
            bottom:
            left:
            right:
        }
        
        
        */ 