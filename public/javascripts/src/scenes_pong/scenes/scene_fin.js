
//Como accedo desde aqui a la BD, require no funciona y los import tampoco

export default class scene_fin extends Phaser.Scene {

    constructor() {
        super({ key: "scene_fin" });
    }

    init(data) {  //Recojo la información que viene del juego

        this.info = {
            aciertos : data.aciertos,
            fallos : data.fallos}
    }

    create() {

        if(this.info.fallos>this.info.aciertos || this.info.aciertos == 0){
            this.icPuntuacion = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 ,"UnaEstrella")
        }else if(this.info.aciertos - this.info.fallos>3){
            this.icPuntuacion = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 ,"TresEstrella")
        }else{
            this.icPuntuacion = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 ,"DosEstrella")
        }

        this.icPuntuacion.setOrigin(0.5, 0.5);

        const canvasWidth = this.sys.game.config.width;
        this.icPuntuacion.setScale(canvasWidth * 0.3/ this.icPuntuacion.width);

        //Este boton servirá para llevar al siguiente juego o a la ventana de inicios
        this.icContinuar = this.add.image(this.sys.game.config.width / 2, this.icPuntuacion.y + this.icPuntuacion.displayHeight /2 -10 , "botonContinuar")
        this.icContinuar.setInteractive();
        this.icContinuar.setScale(canvasWidth * 0.15/ this.icContinuar.width);

        this.icContinuar.setInteractive();

        this.icContinuar.on("pointerdown",()=>{ //Sale del juego, envia los datos al servidor 
            window.location.href = `/juego/finJuego?aciertos=${this.info.aciertos}&fallos=${this.info.aciertos}`;
        })

        /*
        // Hacer que el botón sea interactivo
        this.startButton.setInteractive();
        // Asignar un evento de clic al botón
        this.startButton.on("pointerdown", () => {
            // Cambiar a la escena del juego cuando se hace clic en el botón
            this.scene.start(this.info.juego);
        });*/
    }

}    