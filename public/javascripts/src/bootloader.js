class Bootloader extends Phaser.Scene {  //Sirve para cargar los archivos, solo eso
    constructor() {
        super({ key: "Bootloader" });
    }

    init(data){
        this.idJuego = data.idJuego
    }

    preload() {
        this.load.on("complete", () => {
            this.scene.start("scene_play", { descripcion: this.descripcion, juego: this.juego, idJuego: this.idJuego })
        });

        //Iconos de ventana de inicio y fin
        this.load.image("inicio", "javascripts/assets/botonJugar.png")
        this.load.image("UnaEstrella", "javascripts/assets/estrellita1.png")
        this.load.image("DosEstrella", "javascripts/assets/estrellita2.png")
        this.load.image("TresEstrella", "javascripts/assets/estrellita3.png")
        this.load.image("botonContinuar", "javascripts/assets/botonContinuar.png")
        this.load.image("fondoRosa", "javascripts/assets/fondoRosa.png")

        //Iconos propios del juego
        if (this.idJuego == "1") { //idJuego 1
            this.descripcion = "Presiona la pantalla para mover el cohete.\n Lleva al astronauta a la meta."
            this.juego = "scene_pong"
            this.load.image("ball", "javascripts/assets/astronauta.jpg")
            this.load.image("izquierda", "javascripts/assets/asteroide.png")
            this.load.image("derecha", "javascripts/assets/cohete.png")
            this.load.image("separador", "javascripts/assets/espacio.png")
            this.load.image("meta", "javascripts/assets/meta.png")
        }else if (this.idJuego =="2"){
            this.descripcion = "¡Realiza siguientes operaciones!"
            this.juego = "scene_cuentas"
        }else if (this.idJuego =="3"){
            this.descripcion = "¡Recuerda las imagenes y empareja!"
            this.juego = "scene_parejas"
            this.load.image("card", "javascripts/assets/carta.png")

            this.load.image("sol", "javascripts/assets/cartaSol.png")
            this.load.image("melon", "javascripts/assets/cartaMelon.png")
            this.load.image("calavera", "javascripts/assets/cartaCalavera.png")
            this.load.image("jarra", "javascripts/assets/cartaJarra.png")
            this.load.image("pez", "javascripts/assets/cartaPez.png")
            this.load.image("bota", "javascripts/assets/cartaBota.png")

        }

    }
}

export default Bootloader;