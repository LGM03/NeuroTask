class Bootloader extends Phaser.Scene {  //Sirve para cargar los archivos, solo eso
    constructor() {
        super({ key: "Bootloader_pong"});
    }

    preload() {
        this.load.on("complete",()=>{
            this.scene.start("scene_play")
        });
        this.load.image("ball","javascripts/assets/astronauta.jpg")
        this.load.image("izquierda","javascripts/assets/asteroide.png")
        this.load.image("derecha","javascripts/assets/cohete.png")
        this.load.image("separador","javascripts/assets/espacio.png")
        this.load.image("inicio","javascripts/assets/boton.png")   
        this.load.image("meta","javascripts/assets/meta.png")
        
    }
}

export default Bootloader;