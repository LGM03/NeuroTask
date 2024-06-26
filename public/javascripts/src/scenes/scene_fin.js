
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
            duracion: data.duracion,
            segundos: data.segundos,
            nivel: data.nivel,
            plan: data.plan
        }
    }

    create() {

        this.fondo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "fondoRosa") //imagen de fondo
        this.fondo.setScale(0.5)

        const canvasHeight = this.sys.game.config.height;
        var estiloTexto = {
            fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
            fontSize: '25px',
            color: '#000000',
        };
        //Defino la cantidad de estrellas en funcion de aciertos y fallos 
        if (this.info.fallos > this.info.aciertos || this.info.aciertos == 0) {
            this.icPuntuacion = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "UnaEstrella")
        } else if (this.info.aciertos - this.info.fallos > 3) {
            this.icPuntuacion = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "TresEstrella")
        } else {
            this.icPuntuacion = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "DosEstrella")
        }

        this.icPuntuacion.setOrigin(0.5, 0.5);

        //Posiciono los mensajes de puntuacion y tiempo
        this.tFallos = this.add.text(this.icPuntuacion.x + this.icPuntuacion.width / 5, this.icPuntuacion.y + 20, this.info.fallos * 100 + " pts", estiloTexto)
        this.tFallos.setOrigin(0, 0.5);
        this.tFallos.setScale(1.2);

        this.tAciertos = this.add.text(this.icPuntuacion.x - this.icPuntuacion.x / 5, this.icPuntuacion.y + 20, this.info.aciertos * 100 + " pts", estiloTexto)
        this.tAciertos.setOrigin(0, 0.5);
        this.tAciertos.setScale(1.2);

        if(this.info.duracion.segundos <10){
            this.info.duracion.segundos = "0"+this.info.duracion.segundos
        }

        this.tTiempo = this.add.text(this.icPuntuacion.x - 35, this.icPuntuacion.y + this.icPuntuacion.y / 4 + 30, this.info.duracion.minutos + ":" + this.info.duracion.segundos + " min", estiloTexto)
        this.tTiempo.setOrigin(0, 0.5);
        this.tTiempo.setScale(1.2);


        //Este boton servirá para llevar al siguiente juego o a la ventana de inicios
        this.icContinuar = this.add.image(this.sys.game.config.width / 2, this.icPuntuacion.y + this.icPuntuacion.displayHeight / 2 - 10, "botonContinuar")
        this.icContinuar.setInteractive();
        this.icContinuar.setScale(0.7);

        this.icContinuar.setInteractive();

        this.icContinuar.on("pointerdown", () => { //Sale del juego, envia los datos al servidor 
            if (this.info.plan == null) {
                window.location.href = `/juego/finJuego?aciertos=${this.info.aciertos}&fallos=${this.info.fallos}&idJuego=${this.info.idJuego}&fechaInicio=${this.info.fechaInicio}&duracion=${this.info.segundos}&nivel=${this.info.nivel}`;
            }else{
                window.location.href = `/juego/finPlan?aciertos=${this.info.aciertos}&fallos=${this.info.fallos}&idJuego=${this.info.idJuego}&fechaInicio=${this.info.fechaInicio}&duracion=${this.info.segundos}&nivel=${this.info.nivel}&idTarea=${this.info.plan.idTarea}`;

            }
        })
    }

}    