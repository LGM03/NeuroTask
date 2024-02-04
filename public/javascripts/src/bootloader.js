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
            this.load.image("card", "javascripts/assets/carta.png")
            this.load.image("sol", "javascripts/assets/cartaSol.png")
            this.load.image("melon", "javascripts/assets/cartaMelon.png")
            this.load.image("calavera", "javascripts/assets/cartaCalavera.png")
            this.load.image("jarra", "javascripts/assets/cartaJarra.png")
            this.load.image("pez", "javascripts/assets/cartaPez.png")
            this.load.image("bota", "javascripts/assets/cartaBota.png")

        }else if(this.idJuego=="4"){
            this.descripcion = "¡Ordena las cartas de MENOR a MAYOR!"
            this.juego = "scene_ordenCreciente"
            this.load.image("sol", "javascripts/assets/cartaSol.png")
            this.load.image("melon", "javascripts/assets/cartaMelon.png")
            this.load.image("calavera", "javascripts/assets/cartaCalavera.png")
            this.load.image("jarra", "javascripts/assets/cartaJarra.png")
            this.load.image("pez", "javascripts/assets/cartaPez.png")
            this.load.image("bota", "javascripts/assets/cartaBota.png")
            this.load.image("barril", "javascripts/assets/cartaBarril.png")
            this.load.image("campana", "javascripts/assets/cartaCampana.png")
            this.load.image("corazon", "javascripts/assets/cartaCorazon.png")
            this.load.image("botella", "javascripts/assets/cartaBotella.png")
            this.load.image("sandia", "javascripts/assets/cartaSandia.png")
            this.load.image("paraguas", "javascripts/assets/cartaParaguas.png")

        }else if(this.idJuego == "5"){
            this.descripcion = "¡Ordena las letras y descubre la palabra!"
            this.juego = "scene_anagramas"

        }else if(this.idJuego == "6"){
            this.descripcion = "¡Ordena las palabras y descubre el refrán!"
            this.juego = "scene_refranes"

        }else if(this.idJuego == "7"){
            this.descripcion = "Repite el orden en el que se encienden las bombillas"
            this.juego = "scene_simonDice"
            
            this.load.image("moradoEncendido", "javascripts/assets/morado1.png")
            this.load.image("moradoApagado", "javascripts/assets/morado2.png")
            
            this.load.image("amarilloEncendido", "javascripts/assets/amarillo1.png")
            this.load.image("amarilloApagado", "javascripts/assets/amarillo2.png")
            
            this.load.image("azulEncendido", "javascripts/assets/azul1.png")
            this.load.image("azulApagado", "javascripts/assets/azul2.png")

            this.load.image("rojoEncendido", "javascripts/assets/rojo1.png")
            this.load.image("rojoApagado", "javascripts/assets/rojo2.png")

            this.load.image("memoriza","javascripts/assets/memoriza.png")
            this.load.image("repite","javascripts/assets/repite.png")
        }else if(this.idJuego=="8"){
            this.descripcion = "¡Ordena las cartas de MAYOR a MENOR!"
            this.juego = "scene_ordenDecreciente"
            this.load.image("sol", "javascripts/assets/cartaSol.png")
            this.load.image("melon", "javascripts/assets/cartaMelon.png")
            this.load.image("calavera", "javascripts/assets/cartaCalavera.png")
            this.load.image("jarra", "javascripts/assets/cartaJarra.png")
            this.load.image("pez", "javascripts/assets/cartaPez.png")
            this.load.image("bota", "javascripts/assets/cartaBota.png")
            this.load.image("barril", "javascripts/assets/cartaBarril.png")
            this.load.image("campana", "javascripts/assets/cartaCampana.png")
            this.load.image("corazon", "javascripts/assets/cartaCorazon.png")
            this.load.image("botella", "javascripts/assets/cartaBotella.png")
            this.load.image("sandia", "javascripts/assets/cartaSandia.png")
            this.load.image("paraguas", "javascripts/assets/cartaParaguas.png")
        }else if(this.idJuego == "9"){
            this.descripcion = "¡Memoriza las figuras que aparecen!"
            this.juego = "scene_memorizaFiguras"
            this.load.image("melon", "javascripts/assets/cartaMelon.png")
            this.load.image("sandia", "javascripts/assets/cartaSandia.png")
            this.load.image("paraguas", "javascripts/assets/cartaParaguas.png")
            this.load.image("pera", "javascripts/assets/cartaPera.png")
            this.load.image("mano", "javascripts/assets/cartaMano.png")
            this.load.image("corona", "javascripts/assets/cartaCorona.png")
            this.load.image("maceta", "javascripts/assets/cartaMaceta.png")
            this.load.image("tambor", "javascripts/assets/cartaTambor.png")
        }else if(this.idJuego == "10"){
            this.descripcion = "¡Memoriza los colores que aparecen!"
            this.juego = "scene_memorizaColores"
        }

    }
}

export default Bootloader;