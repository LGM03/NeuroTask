
export default class scene_play extends Phaser.Scene {

    constructor() {
        super({ key: "scene_play" });
    }

    create() {
        // Crear un botón de inicio como texto
        this.startButton = this.add.image(this.sys.game.config.width  - 80,this.sys.game.config.height/2, "inicio");
    
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