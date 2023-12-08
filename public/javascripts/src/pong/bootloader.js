
class Bootloader extends Phaser.Scene {  //Sirve para cargar los archivos, solo eso
    constructor() {
        super({ key: "Bootloader"});
    }

    preload() {
        this.load.on("complete",()=>{
            this.scene.start("scene_play")
        });
        this.load.image("ball","javascripts/assets/ball.png")
        this.load.image("izquierda","javascripts/assets/left_pallete.png")
        this.load.image("derecha","javascripts/assets/right_pallete.png")
        this.load.image("separador","javascripts/assets/separator.png")
        this.load.image("inicio","javascripts/assets/play.png")
        
    }

    

}

export default Bootloader;