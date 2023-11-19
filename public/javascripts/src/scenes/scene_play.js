
//Como accedo desde aqui a la BD, require no funciona y los import tampoco

export default class scene_play extends Phaser.Scene {

    constructor() {
        super({ key: "scene_play" });
    }

    init(data) {

        this.info = {  //Recojo los parametros traidos de quien inicia la escena 
            descripcion: data.descripcion,
            juego: data.juego,
            idJuego: data.idJuego
        }
    }

    create() {

        var estiloInstrucciones = {
            fontFamily: 'Arial',  // Puedes cambiar la fuente aquí o usar la personalizada cargada
            fontSize: '25px',
            fill: '#00000',     // Color del texto
            align: 'center'
        };

        // Crea un objeto de texto con los estilos personalizados
        
        this.fondo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 ,"fondoRosa") //imagen de fondo
        this.fondo.setScale(0.5)

        var text = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - this.sys.game.config.height / 4, this.info.descripcion, estiloInstrucciones);
        text.setOrigin(0.5, 0.5);

        this.startButton = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + this.sys.game.config.height / 6, "inicio")
        this.startButton.setOrigin(0.5, 0.5);

        const canvasHeight = this.sys.game.config.height;
        this.startButton.setScale(canvasHeight * 0.25/ this.startButton.height);

        // Hacer que el botón sea interactivo
        this.startButton.setInteractive();
        // Asignar un evento de clic al botón
        this.startButton.on("pointerdown", () => {
            // Cambiar a la escena del juego cuando se hace clic en el botón
            this.scene.start(this.info.juego, { idJuego: this.info.idJuego });
        });
    }

}    