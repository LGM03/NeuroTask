class Bootloader extends Phaser.Scene {  //Sirve para cargar los archivos, solo eso
    constructor() {
        super({ key: "Bootloader" });
    }

    init(data){
        this.idJuego = data.idJuego
        this.plan = data.plan
    }

    preload() {
        this.load.on("complete", () => {
            if(this.plan == null){
                this.scene.start("scene_dificultad", { descripcion: this.descripcion, juego: this.juego, idJuego: this.idJuego, plan : this.plan })
            }else{
                this.scene.start("scene_play", { descripcion: this.descripcion, juego: this.juego, idJuego: this.idJuego, plan : this.plan })
            }
        });

        //Iconos de ventana de inicio y fin
        this.load.image("UnaEstrella", "javascripts/assets/estrellita1.png")
        this.load.image("DosEstrella", "javascripts/assets/estrellita2.png")
        this.load.image("TresEstrella", "javascripts/assets/estrellita3.png")
        this.load.image("botonContinuar", "javascripts/assets/botonContinuar.png")
        this.load.image("fondoRosa", "javascripts/assets/fondoRosa.png")

        //Iconos propios del juego
        if (this.idJuego == "1") { 
            this.descripcion = "Presiona la pantalla para mover el cohete.\n Lleva al astronauta a la meta."
            this.juego = "scene_pong"
            this.load.image("ball", "javascripts/assets/astronauta.jpg")
            this.load.image("izquierda", "javascripts/assets/asteroide.png")
            this.load.image("derecha", "javascripts/assets/cohete.png")
            this.load.image("separador", "javascripts/assets/espacio3.jpg")
            this.load.image("meta", "javascripts/assets/meta.png")

        }else if (this.idJuego =="2"){
            this.descripcion = "¡Realiza siguientes operaciones!"
            this.juego = "scene_cuentas"
            
            this.load.image("uno", "javascripts/assets/uno.png")        
            this.load.image("dos", "javascripts/assets/dos.png")           
            this.load.image("tres", "javascripts/assets/tres.png")           
            this.load.image("cuatro", "javascripts/assets/cuatro.png")         
            this.load.image("cinco", "javascripts/assets/cinco.png")
            this.load.image("seis", "javascripts/assets/seis.png")
            this.load.image("siete", "javascripts/assets/siete.png")
            this.load.image("ocho", "javascripts/assets/ocho.png")
            this.load.image("nueve", "javascripts/assets/nueve.png")
            this.load.image("cero", "javascripts/assets/cero.png")
            this.load.image("corregir", "javascripts/assets/corregir.png")
            this.load.image("aceptar", "javascripts/assets/aceptar.png")

        }else if (this.idJuego =="3"){
            this.descripcion = "¡Recuerda las imagenes y empareja!"
            this.juego = "scene_parejas"

        }else if(this.idJuego=="4"){
            this.descripcion = "¡Ordena las cartas de MENOR a MAYOR!"
            this.juego = "scene_ordenCreciente"

        }else if(this.idJuego == "5"){
            this.descripcion = "¡Ordena las letras y descubre la palabra!"
            this.juego = "scene_anagramas"

        }else if(this.idJuego == "6"){
            this.descripcion = "¡Ordena las palabras y descubre el refrán!"
            this.juego = "scene_refranes"

        }else if(this.idJuego == "7"){
            this.descripcion = "Repite el orden en el que se encienden las bombillas"
            this.juego = "scene_simonDice"
            this.load.image("memoriza","javascripts/assets/memoriza.png")
            this.load.image("repite","javascripts/assets/repite.png")

        }else if(this.idJuego=="8"){
            this.descripcion = "¡Ordena las cartas de MAYOR a MENOR!"
            this.juego = "scene_ordenDecreciente"
        }else if(this.idJuego == "9"){
            this.descripcion = "¡Memoriza las figuras que aparecen!"
            this.juego = "scene_memorizaFiguras"

        }else if(this.idJuego == "10"){
            this.descripcion = "¡Memoriza los colores que aparecen!"
            this.juego = "scene_memorizaColores"
            this.load.image("memoriza","javascripts/assets/siguiente.png")

        }

    }
}

export default Bootloader;