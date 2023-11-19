
//Como accedo desde aqui a la BD, require no funciona y los import tampoco

export default class scene_fin extends Phaser.Scene {

    constructor() {
        super({ key: "scene_fin" });
    }

    init(data) {  //Recojo la información que viene del juego

        this.info = {
            idJuego: data.idJuego,
            aciertos: data.aciertos,
            fallos: data.fallos,
            fechaInicio: data.fechaInicio,
            duracion: data.duracion
        }
    }

    create() {

        this.fondo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 ,"fondoRosa") //imagen de fondo
        this.fondo.setScale(0.5)

        const canvasHeight = this.sys.game.config.height;
        var estiloTexto = {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: '25px',
            color: '#000000',  
        };

        if (this.info.fallos > this.info.aciertos || this.info.aciertos == 0) {
            this.icPuntuacion = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "UnaEstrella")
        } else if (this.info.aciertos - this.info.fallos > 3) {
            this.icPuntuacion = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "TresEstrella")
        } else {
            this.icPuntuacion = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "DosEstrella")
        }

        this.icPuntuacion.setOrigin(0.5, 0.5);
        this.icPuntuacion.setScale(canvasHeight / (this.icPuntuacion.height*1.2));
    
        
        this.tAciertos = this.add.text(this.icPuntuacion.x + this.icPuntuacion.width/6, this.icPuntuacion.y + this.icPuntuacion.height/15 , this.info.aciertos*100+ " pts",estiloTexto)
        this.tAciertos.setScale(canvasHeight / (this.icPuntuacion.height*0.8));

 
        //Este boton servirá para llevar al siguiente juego o a la ventana de inicios
        this.icContinuar = this.add.image(this.sys.game.config.width / 2, this.icPuntuacion.y + this.icPuntuacion.displayHeight / 2 - 10, "botonContinuar")
        this.icContinuar.setInteractive();
        this.icContinuar.setScale(canvasHeight / (this.icPuntuacion.height*2.5));

        this.icContinuar.setInteractive();

        this.icContinuar.on("pointerdown", () => { //Sale del juego, envia los datos al servidor  //Tiene que haber otra forma de hacer esto
            window.location.href = `/juego/finJuego?aciertos=${this.info.aciertos}&fallos=${this.info.fallos}&idJuego=${this.info.idJuego}&fechaInicio=${this.info.fechaInicio}&duracion=${this.info.duracion}`;
        })

       
    }

}    