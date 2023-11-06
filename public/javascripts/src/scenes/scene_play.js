
//Como accedo desde aqui a la BD, require no funciona y los import tampoco

export default class scene_play extends Phaser.Scene {

    constructor() {
        super({ key: "scene_play" });
    }

    create() {

        var textStyle = {
            fontFamily: 'Arial',  // Puedes cambiar la fuente aquí o usar la personalizada cargada
            fontSize: '25px',
            fill: '#00000',     // Color del texto
        };


        // Crea un objeto de texto con los estilos personalizados
        var text = this.add.text(this.sys.game.config.width/2 ,this.sys.game.config.height/2 -this.sys.game.config.height/4, 'Texto con fondo azul y bordes redondeados', textStyle);
        text.setOrigin(0.5, 0.5);

        // Crear un botón de inicio como texto
        this.startButton = this.add.image(this.sys.game.config.width/2,this.sys.game.config.height/2 + this.sys.game.config.height/6, "inicio");
    
        // Hacer que el botón sea interactivo
        this.startButton.setInteractive();
        this.startButton.setScale(0.2);
        // Asignar un evento de clic al botón
        this.startButton.on("pointerdown", () => {
            // Cambiar a la escena del juego cuando se hace clic en el botón
            this.scene.start("scene_pong");
        });
    }


    
}    