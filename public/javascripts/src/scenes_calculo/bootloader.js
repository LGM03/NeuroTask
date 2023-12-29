class Bootloader extends Phaser.Scene {  //Sirve para cargar los archivos, solo eso
    constructor() {
        super({ key: "Bootloader_calculo"});
    }

    preload() {
        this.load.on("complete",()=>{
            this.scene.start("scene_play")
        });
    }
}

export default Bootloader;