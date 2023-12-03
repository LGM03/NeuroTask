
export default class scene_cuentas extends Phaser.Scene {

    constructor() {
        super({ key: "scene_cuentas" });
        this.fechaInicio = new Date();
    }

    init(data){
        this.idJuego = data.idJuego
    }

    create() {
        const MS = 1000
        this.duracion = 60  //en segundos
        this.time.delayedCall(this.duracion * MS , this.finalizarJuego, [], this);

        this.aciertos = 0;
        this.fallos = 0;
        
        // Crear un grupo para las cartas
        var cardsGroup = this.add.group();

        // Coordenadas iniciales para las cartas
        var startX = 100;
        var startY = 100;
        var cardWidth = 80;
        var cardHeight = 120;

        // Crear 8 cartas en un bucle
        for (var i = 0; i < 8; i++) {
            var card = this.add.rectangle(startX + i * 100, startY, cardWidth, cardHeight, 0x00ff00);
            card.setInteractive(); // Hacer la carta interactiva
            cardsGroup.add(card);
        }

        // Detectar clics en las cartas
        this.input.on('gameobjectdown', function (pointer, gameObject) {
            console.log('Carta clickeada');
            // Puedes agregar acciones adicionales al hacer clic en una carta
        });
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

        /*
         //Pala izq 
         if(this.cursor_S.isDown){ //si la flecha hacia abajo esta presionada 
            this.izquierda.body.setVelocityY(300)
        }else if (this.cursor_W.isDown){
            this.izquierda.body.setVelocityY(-300)
        }else{
            this.izquierda.body.setVelocityY(0)
        }*/

    }

    chocaPala(){
        this.ball.setVelocityY(Phaser.Math.Between(-120,120))
    }

    
    finalizarJuego() {
        
        // Por ejemplo, puedes cambiar a otra escena
        this.scene.start("scene_fin", 
                {aciertos : this.aciertos, 
                    fallos : this.fallos, 
                    idJuego : this.idJuego, 
                    fechaInicio : this.fechaInicio,
                duracion : this.duracion});
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