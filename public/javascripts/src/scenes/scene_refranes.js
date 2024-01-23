export default class scene_refranes extends Phaser.Scene {


    constructor() {
        super({ key: "scene_refranes" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.casos = ["Más vale estar solo que mal acompañado",
            "Perro ladrador poco mordedor", "A caballo regalado no le mires el dentado", "A lo hecho pecho", "Al mal tiempo buena cara", 
            "Cada loco con su tema","De tal palo tal astilla","El que la hace la paga", "Dinero llama dinero","El mundo es un pañuelo",
            "A la tercera va la vencida","Cada oveja con su pareja", "Más vale prevenir que lamentar" ,"Más vale tarde que nunca",
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

        this.fondo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "fondoRosa"); // Cambia la imagen de fondo según tu necesidad
        this.fondo.setScale(0.5);

        // Crear la interfaz de usuario
        this.add.text(this.sys.canvas.width / 2, 120, "Ordenas las palabras y descubre el refrán", {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5, 0.5)

        this.enviar = this.add.text(this.sys.canvas.width / 2 - 80,300, "Aceptar", {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        })
        this.enviar.setInteractive();
        this.enviar.tipo = "enviar"

        this.corregir = this.add.text(this.sys.canvas.width / 2 + 130, 300, "Corregir", {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        })
        this.corregir.setInteractive();
        this.corregir.tipo = "corregir"

        this.crearInterfaz();

        // Generar la primera operación
        this.input.on('gameobjectdown', function (pointer, gameObject) {
            if (gameObject.tipo === 'palabra') {
                var sol = this.respuesta.text
                this.respuesta.setText(sol + " "+gameObject.value)
                //this.verificarRespuesta(gameObject.value);
            } else if (gameObject.tipo === 'enviar') {
                this.verificarRespuesta(this.respuesta.text);
            } else if (gameObject.tipo === 'corregir' && this.respuesta.text.length > 0) {
                var sol = this.respuesta.text
                this.respuesta.setText(sol.slice(0, -1))
            }
        }, this);
    }

    crearInterfaz() {
        // Sección de la operación
        var elegido = Phaser.Math.Between(0, this.casos.length - 1)
        this.refran = this.casos[elegido] //Elijo el refran aleatoriamente
        //Para que no se repitan dos iguales en un mismo juego los elimino al sacarlos
        if(this.casos.length!=1){
            this.casos.splice(elegido,1)
        }
        let xPos = 100;
        this.palabrasGroup = this.add.group();

        var arrayDePalabras =  this.refran.split(' '); //Desordeno la frase
        arrayDePalabras.sort(function() {
            return 0.5 - Math.random();
        });
    
        for (let i = 0; i < arrayDePalabras.length; i++) {
            const letra = this.add.text(this.sys.canvas.width / 2 + 80 * i, this.sys.canvas.height / 2, arrayDePalabras[i], {
                fontSize: '24px',
                color: '#000',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
            letra.setInteractive();
            letra.tipo = 'palabra';
            letra.value = arrayDePalabras[i];
            this.palabrasGroup.add(letra) //Agrego las letras a un grupo
            xPos += 100;
        }

        this.respuesta = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 120, "", {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5, 0.5)
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
