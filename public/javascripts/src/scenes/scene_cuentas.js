export default class scene_cuentas extends Phaser.Scene {

    constructor() {
        super({ key: "scene_cuentas" });
        this.puntuacion = 0;
        this.operacionActual = '';
        this.solucion = 0;
        this.fallos = 0;
        this.fechaInicio = new Date()
    }

    create() {

        const MS = 1000
        this.duracion = 30  //en segundos
        this.time.delayedCall(this.duracion * MS , this.finalizarJuego, [], this);


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
                this.respuesta.setText(sol+gameObject.value)
                //this.verificarRespuesta(gameObject.value);
            }else if(gameObject.tipo === 'solucionar'){
                this.verificarRespuesta(this.respuesta.text);
            }else if(gameObject.tipo === 'corregir' && this.respuesta.text.length>0){
                var sol = this.respuesta.text
                this.respuesta.setText(sol.slice(0,-1))
            }
        }, this);
    }

    crearInterfaz() {
        // Sección de la operación
        this.textoOperacion = this.add.text(this.sys.game.config.width / 2, 100, '', {
            fontSize: '32px',
            color: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        // Sección de los números
        const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
        let xPos = 100;
        let yPos = 200;

        this.respuesta = this.add.text(xPos+ 80, 120, "", {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        })

        for (let i = 0; i < numeros.length; i++) {
            const numero = this.add.text(xPos, yPos, numeros[i].toString(), {
                fontSize: '24px',
                color: '#fff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);
            numero.setInteractive();
            numero.tipo = 'numero';
            numero.value = numeros[i];
            xPos += 80;

            // Ajustar la posición para cada fila
            if (i === 2 || i === 5) {
                xPos = 100;
                yPos += 60;
            }

            console.log(numero.value)
        }

        this.enviar = this.add.text(xPos+ 110, 120, "Aceptar", {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        })
        this.enviar.setInteractive();
        this.enviar.tipo = "solucionar"

        this.corregir = this.add.text(xPos+ 130, 300, "Corregir", {
            fontSize: '24px',
            color: '#fff',
            fontFamily: 'Arial'
        })
        this.corregir.setInteractive();
        this.corregir.tipo = "corregir"
    
    }

    generarOperacion() {
        
        const operadores = ['+', '-', '*'];
        const operador = Phaser.Math.RND.pick(operadores);
        this.respuesta.setText("");
        switch (operador) {
            case '+':
                var num1 = Phaser.Math.Between(1, 100);
                var num2 = Phaser.Math.Between(1, 100);
                this.solucion = num1 + num2;
                break;
            case '-':
                var num1 = Phaser.Math.Between(10, 100);
                var num2 = Phaser.Math.Between(1, num1);
                this.solucion = num1 - num2;
                break;
            case '*':
                var num1 = Phaser.Math.Between(1, 50);
                var num2 = Phaser.Math.Between(2, 10);
                this.solucion = num1 * num2;
                break;
        }

        this.operacionActual = `${num1} ${operador} ${num2}`;
        this.textoOperacion.setText(this.operacionActual);
    }

    verificarRespuesta(respuesta) {
        if (parseInt(respuesta) === this.solucion) {
            this.puntuacion++;
            this.generarOperacion();
        } else {
            this.fallos++;
            console.log('Respuesta incorrecta');
            this.respuesta.setText("")

        }
    }

    finalizarJuego() {
        const minutos = Math.floor(this.duracion / 60000);
        const segundos = (((this.duracion*1000)  % 60000) / 1000).toFixed(0);

        this.scene.start("scene_fin", 
                {aciertos : this.puntuacion, 
                    fallos : this.fallos, 
                    idJuego : this.idJuego, 
                    fechaInicio : this.fechaInicio,
                    duracion :{minutos,segundos}});
    }


}
