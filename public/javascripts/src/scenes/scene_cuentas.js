export default class scene_cuentas extends Phaser.Scene {

    constructor() {
        super({ key: "scene_cuentas" });
        this.puntuacion = 0;
        this.operador1 = ""
        this.operador2 = ""
        this.operacion = ""
        this.solucion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date()
        this.teclas = ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "cero"]
        this.operadores = ['+', '-'];

    }


    init(data) {
        this.idJuego = data.idJuego,
            this.nivel = data.nivel,
            this.plan = data.plan

        if (this.plan != null) {
            this.nivel = this.plan.nivel
        }

        switch (this.nivel) {
            case 1:  
                this.maxSuma = 10
                this.maxResta = 10
                break;
            case 2:
                this.maxSuma = 30
                this.maxResta = 20
                break;
            case 3:
                this.operadores = ['+', '-', 'x'];
                this.maxSuma = 50
                this.maxResta = 60
                break;
        }

    }


    create() {

        const MS = 1000
        this.duracion = 80  //en segundos
        this.time.delayedCall(this.duracion * MS, this.finalizarJuego, [], this);


        this.fondo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "fondoRosa"); // Cambia la imagen de fondo según tu necesidad
        this.fondo.setScale(0.5);

        // Crear la interfaz de usuario
        this.crearInterfaz();

        // Generar la primera operación
        this.generarOperacion();

        // Detectar clics en los números
        this.input.on('gameobjectdown', function (pointer, gameObject) {
            if (gameObject.tipo === 'numero') {
                var sol = this.respuesta.text
                this.respuesta.setText(sol + gameObject.value)
                //this.verificarRespuesta(gameObject.value);
            } else if (gameObject.tipo === 'solucionar') {
                this.verificarRespuesta(this.respuesta.text);
            } else if (gameObject.tipo === 'corregir' && this.respuesta.text.length > 0) {
                var sol = this.respuesta.text
                this.respuesta.setText(sol.slice(0, -1))
            }
        }, this);
    }

    crearInterfaz() {
        // Sección de la operación
        this.operador1 = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 12, '', {
            fontSize: '80px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        this.operador2 = this.add.text(this.sys.game.config.width / 2, 2 * this.sys.game.config.height / 12 +20, '', {
            fontSize: '80px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.operacion = this.add.text(6 * this.sys.game.config.width / 13 -30, 2 * this.sys.game.config.height / 12, '', {
            fontSize: '95px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Sección de los números
        const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        let xPos = 3;
        let yPos = 6;

        this.respuesta = this.add.text(this.sys.game.config.width / 2, 2 * this.sys.game.config.height / 12 +20, "_________", {
            fontSize: '80px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5)

        this.respuesta = this.add.text(this.sys.game.config.width / 2, 4 * this.sys.game.config.height / 13, "", {
            fontSize: '80px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5)

        for (let i = 0; i < numeros.length; i++) {

            const numero = this.add.image(xPos * this.sys.game.config.width / 12, yPos * this.sys.game.config.height / 12 -10, this.teclas[i]).setOrigin(0.5).setScale(0.9);
            numero.setInteractive();
            numero.tipo = 'numero';
            numero.value = numeros[i];
            xPos += 2;

            // Ajustar la posición para cada fila
            if (i === 2 || i === 5) {
                xPos = 3;
                yPos += 2.2;
            }
        }

        this.enviar = this.add.image((xPos - 2) * this.sys.game.config.width / 12, (yPos - 4) * this.sys.game.config.height / 12 -30, "aceptar", {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setScale(0.9)
        this.enviar.setInteractive();
        this.enviar.tipo = "solucionar"

        this.corregir = this.add.image((xPos - 2) * this.sys.game.config.width / 12, (yPos - 2) * this.sys.game.config.height / 12 -20, "corregir", {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setScale(0.9)
        this.corregir.setInteractive();
        this.corregir.tipo = "corregir"

    }

    generarOperacion() {

        const operador = Phaser.Math.RND.pick(this.operadores);
        this.respuesta.setText("");
        switch (operador) {
            case '+':
                var num1 = Phaser.Math.Between(1, this.maxSuma);
                var num2 = Phaser.Math.Between(1, this.maxSuma);
                this.solucion = num1 + num2;
                break;
            case '-':
                var num1 = Phaser.Math.Between(1, this.maxResta);
                var num2 = Phaser.Math.Between(1, num1);
                this.solucion = num1 - num2;
                break;
            case 'x':
                var num1 = Phaser.Math.Between(1, 30);
                var num2 = Phaser.Math.Between(2, 5);
                this.solucion = num1 * num2;
                break;
        }

        const fontSize = Math.min(this.sys.game.scale.width * 0.05, this.sys.scale.height * 0.05);
        const textStyle = { font: `${fontSize}px Arial`, fill: '#ffffff' };

        // Crea el texto en el centro de la pantalla
        this.operador1.setText(num1, textStyle).setOrigin(0.5);
        this.operador2.setText(num2, textStyle).setOrigin(0.5);
        this.operacion.setText(operador, textStyle).setOrigin(0.5);
    }

    verificarRespuesta(respuesta) {
        if (parseInt(respuesta) === this.solucion) {
            this.puntuacion++;
            this.cubrirResultado(true)
        } else {
            this.fallos++;
            this.cubrirResultado(false)
        }

        this.respuesta.setText("")
        this.generarOperacion();
    }

    finalizarJuego() {
        const minutos = Math.floor(this.duracion / 60);
        const segundos = ((this.duracion % 60)).toFixed(0);

        this.scene.start("scene_fin",
            {
                aciertos: this.puntuacion,
                fallos: this.fallos,
                idJuego: this.idJuego,
                fechaInicio: this.fechaInicio,
                duracion: { minutos, segundos },
                segundos: this.duracion,
                nivel: this.nivel,
                plan: this.plan
            });
    }

    cubrirResultado(esAcierto) {
      
        
        var imagen = "fallo"
        if (esAcierto) {
            imagen = "acierto"
        }
        var cover = this.add.image(this.sys.game.canvas.width / 2, this.sys.game.canvas.height / 2, imagen).setScale(0.4).setOrigin(0.5, 0.5)//imagen de fondo


        this.tweens.add({
            targets: cover,
            alpha: 0,
            duration: 1250,
            ease: 'Linear',
            onComplete: () => {
                cover.destroy();
            }
        });
    }



}
