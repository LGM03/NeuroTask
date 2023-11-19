class Bootloader extends Phaser.Scene {  //Sirve para cargar los archivos, solo eso
    constructor() {
        super({ key: "Bootloader"});
    }

    preload() {
        this.load.on("complete",()=>{
            this.scene.start("scene_play",{descripcion: "Presiona la pantalla para mover el cohete.\n Lleva al astronauta a la meta.", juego : "scene_pong", idJuego : "1"})
        });

        //Iconos de ventana de inicio y fin
        this.load.image("inicio","javascripts/assets/boton.png")  
        this.load.image("UnaEstrella","javascripts/assets/estrellita1.png")
        this.load.image("DosEstrella","javascripts/assets/estrellita2.png")
        this.load.image("TresEstrella","javascripts/assets/estrellita3.png")
        this.load.image("botonContinuar","javascripts/assets/botonVacio.png")


        //Iconos propios del juego
        this.load.image("ball","javascripts/assets/astronauta.jpg")
        this.load.image("izquierda","javascripts/assets/asteroide.png")
        this.load.image("derecha","javascripts/assets/cohete.png")
        this.load.image("separador","javascripts/assets/espacio.png")
         
        this.load.image("meta","javascripts/assets/meta.png")
        
    }
}

export default Bootloader;