import Palas from "../gameObjects/palas.js";
export default class scene_pong extends Phaser.Scene {

    constructor() {
        super({ key: "scene_pong" });
        this.fechaInicio = new Date();
    }

    init(data){
        this.idJuego = data.idJuego
    }

    create() {
        const MS = 1000
        //Marca el final de la partida, en tiempo, 2 Minutos medidos en ms (120 000)

        //Puesto a 10.000 ms para pruebas (10s)
        this.duracion = 20  //en segundos
        this.time.delayedCall(this.duracion * MS , this.finalizarJuego, [], this);


        this.puntosD = 0;
        this.puntosI = 0;
        
        let center_width = this.sys.game.config.width/2;
        let center_height = this.sys.game.config.height/2;
        let width = this.sys.game.config.width;
        let height = this.sys.game.config.height;

        this.add.text(center_width - 5,15,"-", {
            color: '#000000'
        });
        this.puntosDerecha = this.add.text(center_width - 25, 15,this.puntosD, {
            color: '#000000'
        });
        this.puntosIzquierda = this.add.text(center_width + 15, 15,this.puntosI , {
            color: '#000000'
        });

        this.add.image(center_width,center_height ,"separador") //imagen de fondo
        var meta = this.add.image(30,center_height,"meta")
        meta.setScale(0.5)

        const canvasHeight = this.sys.game.config.height;
        
        this.izquierda2 = new Palas(this, width /4 ,height/6,"izquierda") //ok

        this.izquierda2.setScale(canvasHeight * 0.2/ this.izquierda2.height);

        this.izquierda3 = new Palas(this, width /2 ,height-height/6,"izquierda") //ok

        this.izquierda3.setScale(canvasHeight * 0.2/ this.izquierda3.height);
        
        
        this.derecha = new Palas(this,center_width * 2 - 30,center_height,"derecha")
        
        this.derecha.setScale(canvasHeight * 0.25/ this.derecha.height);

        this.ball = this.physics.add.image(center_width,center_height ,"ball")
        this.ball.setVelocityX(350);

        //#######
        this.ball.setScale(canvasHeight * 0.2/ this.ball.height);


        this.ball.setBounce(1); //Que rebote a la misma velocidad con la que choco
        this.physics.world.setBoundsCollision(false,false,true,true)//chocques con izq,derecha,arriba,abajo
        this.ball.setCollideWorldBounds(true);

        //Fisicas

        this.physics.add.collider(this.ball, this.izquierda2,  this.chocaPala  ,  null,this)
        this.physics.add.collider(this.ball, this.izquierda3,  this.chocaPala  ,  null,this)
        this.physics.add.collider(this.ball, this.derecha,  this.chocaPala  ,  null,this)

        //Controles
        //Pala derecha
        this.cursor = this.input.keyboard.createCursorKeys(); //crea en el atributo las flechitas

        /*
        //Pala izq
        this.cursor_W= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.cursor_S= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
*/

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

        //Control de las palas

        //Pala derecha
        if(this.cursor.down.isDown){ //si la flecha hacia abajo esta presionada 
            this.derecha.body.setVelocityY(300)
        }else if (this.cursor.up.isDown){
            this.derecha.body.setVelocityY(-300)
        }else{
            this.derecha.body.setVelocityY(0)
        }

    }

    chocaPala(){
        this.ball.setVelocityY(Phaser.Math.Between(-120,120))
    }

    
    finalizarJuego() {
        const minutos = Math.floor(this.duracion / 60000);
        const segundos = ((this.duracion  % 60000) / 1000).toFixed(0);
        // Por ejemplo, puedes cambiar a otra escena
        this.scene.start("scene_fin", 
                {aciertos : this.puntosI, 
                    fallos : this.puntosD, 
                    idJuego : this.idJuego, 
                    fechaInicio : this.fechaInicio,
                    duracion :{minutos,segundos}});
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