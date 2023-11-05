
class Bootloader extends Phaser.Scene {  //Sirve para cargar los archivos, solo eso
    constructor() {
        super({ key: "Bootloader"});
    }

    preload() {
        this.load.on("complete",()=>{
            this.scene.start("scene_play")
        });
        this.load.image("ball","./assets/ball.png")
        this.load.image("izquierda","./assets/left_pallete.png")
        this.load.image("derecha","./assets/right_pallete.png")
        this.load.image("separador","./assets/separator.png")
        this.load.image("inicio","./assets/play.png")
        
    }

    

}

export default Bootloader;