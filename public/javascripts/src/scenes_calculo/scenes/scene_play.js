
//Como accedo desde aqui a la BD, require no funciona y los import tampoco

export default class scene_play extends Phaser.Scene {

    constructor() {
        super({ key: "scene_play" });
    }

    create() {

        var estiloInstrucciones = {
            fontFamily: 'Arial',  // Puedes cambiar la fuente aquí o usar la personalizada cargada
            fontSize: '25px',
            fill: '#00000',     // Color del texto
        };

        var estiloBotonInicio = {
            fontFamily: 'Arial',
            fontSize: '25px',
            color: '#FFFFFF',
            backgroundColor: '##FF6D26',
            fontWeight: 'bold',
            padding: {
                x: 15,
                y: 15
            },
            borderRadius: '10px',
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 5,
                fill: true
            }
        };


        // Crea un objeto de texto con los estilos personalizados
        var text = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 - this.sys.game.config.height / 4, 'Calculo mental', estiloInstrucciones);
        text.setOrigin(0.5, 0.5);

        // Crear un botón de inicio como texto
        // this.startButton = this.add.image(this.sys.game.config.width/2,this.sys.game.config.height/2 + this.sys.game.config.height/6, "inicio");
        this.startButton = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2 + this.sys.game.config.height / 6, "¡EMPEZAR A JUGAR!", estiloBotonInicio)
        this.startButton.setOrigin(0.5, 0.5);

        var gradient = this.startButton.context.createLinearGradient(0, 0, 0, this.startButton.height);
        gradient.addColorStop(0, '#FFD700'); // Amarillo claro
        gradient.addColorStop(1, '#FFA500'); // Naranja

        this.startButton.setBackgroundColor(gradient);


        
        // Hacer que el botón sea interactivo
        this.startButton.setInteractive();
        // Asignar un evento de clic al botón
        this.startButton.on("pointerdown", () => {
            // Cambiar a la escena del juego cuando se hace clic en el botón
            this.scene.start("scene_pong");
        });
    }

}    