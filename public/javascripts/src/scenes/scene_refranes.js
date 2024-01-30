export default class scene_refranes extends Phaser.Scene {

    constructor() {
        super({ key: "scene_refranes" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.casos = ["Más vale estar solo que mal acompañado",
            "Perro ladrador poco mordedor", "A caballo regalado no le mires el dentado", "A lo hecho pecho", "Al mal tiempo buena cara", 
            "Cada loco con su tema","De tal palo tal astilla","El que la hace la paga", "Dinero llama dinero","El mundo es un pañuelo",
            "Cada oveja con su pareja", "Más vale prevenir que lamentar" ,"Más vale tarde que nunca",
            "En boca cerrada no entran moscas", "Al que madruga Dios le ayuda","El que calla otorga", "Amor con hambre no dura",
            "Tira la piedra y esconde la mano","El que ríe el último ríe mejor"]
    }

    init(data){
        this.idJuego = data.idJuego
    }

    
    create() {
        const MS = 1000
        this.duracion = 20  //en segundos
        this.time.delayedCall(this.duracion * MS , this.finalizarJuego, [], this);  //Finaliza el juego pasado el tiempo
        
        this.crearInterfaz(); 
    }

    crearInterfaz() {
        // Sección de la operación
        var elegido = Phaser.Math.Between(0, this.casos.length - 1)
        this.refran = this.casos[elegido] //Elijo el refran aleatoriamente
        //Para que no se repitan dos iguales en un mismo juego los elimino al sacarlos
        if(this.casos.length!=1){
            this.casos.splice(elegido,1)
        }

        var arrayDePalabras =  this.refran.split(' '); //Desordeno la frase
        arrayDePalabras.sort(function() {
            return 0.5 - Math.random();
        });

        $('#juegoLenguaje').removeClass('d-none')
        arrayDePalabras.forEach((element=>{
            var botonPalabra = '<div class = "col" > <button class="btn botonPalabra rounded p-2 m-1 w-100">'+element+'</button></div>'
            $('#contenedorBotones').append(botonPalabra)
        }))
    
    }

    verificarRespuesta() {  //Colorear algo
        if (this.refran== this.respuesta.text.trim()) {
            console.log("Acierto")
           this.puntuacion++
        } else {
            console.log("Fallo")
            this.fallos++
        }
        this.respuesta.setText("")
        this.palabrasGroup.clear(true,true)  //Vacio las letras de solucion y las palabras

        this.crearInterfaz();
    }

    finalizarJuego() {
        const minutos = Math.floor(this.duracion / 60000);
        const segundos = (((this.duracion * 1000) % 60000) / 1000).toFixed(0);

        this.scene.start("scene_fin",
            {
                aciertos: this.puntuacion,
                fallos: this.fallos,
                idJuego: this.idJuego,
                fechaInicio: this.fechaInicio,
                duracion: { minutos, segundos },
                segundos : this.duracion
            });
    }

}

$(function(){
    console.log("hola")
    let fraseFormada = []
    $(document).on("click",".botonPalabra",function(event){
        fraseFormada.push($(this).text())
        $("#fraseFormada").text( $("#fraseFormada").text()+ " "+$(this).text())
    })
})
