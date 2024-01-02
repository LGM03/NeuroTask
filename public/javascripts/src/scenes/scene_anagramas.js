export default class scene_anagramas extends Phaser.Scene {


    constructor() {
        super({ key: "scene_anagramas" });
        this.puntuacion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date();
        this.casos = [["ROMA", "AMOR"], ["LLENABA", "BALLENA"], ["QUIEREN", "ENRIQUE"],
        ["CUADERNO", "EDUCARON"], ["ECUADOR", "ACUERDO"], ["BOTINES", "BISONTE"], ["AMIGA", "MAGIA"], ["DIVA", "VIDA"]]
    }

    create() {
        const MS = 1000
        this.duracion = 20  //en segundos
        this.time.delayedCall(this.duracion * MS, this.finalizarJuego, [], this);  //Finaliza el juego pasado el tiempo

        this.fondo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "fondoRosa"); // Cambia la imagen de fondo según tu necesidad
        this.fondo.setScale(0.5);

        // Crear la interfaz de usuario
        this.add.text(this.sys.canvas.width / 2, 120, "Reordena las letras y obten una nueva palabra", {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5, 0.5)

        this.enviar = this.add.text(this.sys.canvas.width / 2 - 80, 300, "Aceptar", {
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
            if (gameObject.tipo === 'letra') {
                var sol = this.respuesta.text
                this.respuesta.setText(sol + gameObject.value)
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
        this.arrayAnagrama = this.casos[elegido]
        //Si quedan mas elementos en el array lo saco para que no se repita
        //Si solo queda ese no, para evitar errores.
        if (this.casos.length != 1) { 
            this.casos.splice(elegido, 1)
        }
        var palabra = this.arrayAnagrama[0]

        this.palabra = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 4, palabra, {
            fontSize: '24px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5, 0.5)

        let xPos = 100;

        this.letrasGroup = this.add.group();
        var arrayDeLetras = palabra.split('');
        arrayDeLetras.sort(function () {
            return 0.5 - Math.random();
        });

        for (let i = 0; i < palabra.length; i++) {
            const letra = this.add.text(this.sys.canvas.width / 2 - 80 * (palabra.length / 2 - 1) + 80 * i, this.sys.canvas.height / 2, arrayDeLetras[i], {
                fontSize: '24px',
                color: '#000',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
            letra.setInteractive();
            letra.tipo = 'letra';
            letra.value = arrayDeLetras[i];
            this.letrasGroup.add(letra) //Agrego las letras a un grupo
            xPos += 100;
        }

        this.respuesta = this.add.text(this.sys.canvas.width / 2, this.sys.canvas.height / 2 + 120, "", {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5, 0.5)


    }

    verificarRespuesta() {  //Colorear algo
        if (this.arrayAnagrama[1] == this.respuesta.text) {
            this.puntuacion++
        } else {
            this.fallos++
        }
        this.respuesta.setText("")
        this.letrasGroup.clear(true, true)  //Vacio las letras de solucion y las palabras
        this.palabra.destroy()
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
                duracion: { minutos, segundos }
            });
    }

}
