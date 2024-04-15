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
        this.nSoluciones = 3;
        this.listaSoluciones = []
        this.RONDAS_TOTALES = 10
        this.rondas_actuales=0
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
        this.textSoluciones = this.add.group();

        this.fondo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "fondoRosa"); // Cambia la imagen de fondo según tu necesidad
        this.fondo.setScale(0.5);

        // Crear la interfaz de usuario
        this.crearInterfaz();

        // Generar la primera operación
        this.generarOperacion();

        // Detectar clics en los números
        this.input.on('gameobjectdown', function (pointer, gameObject) {
            if (gameObject.tipo === 'numero') {
                this.respuesta.setText(gameObject.valor)
                this.verificarRespuesta(gameObject.valor);
                this.rondas_actuales++;
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

        this.add.text(this.sys.game.config.width / 2, 2 * this.sys.game.config.height / 12 +20, "_________", {
            fontSize: '80px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5)

        this.respuesta = this.add.text(this.sys.game.config.width / 2, 4 * this.sys.game.config.height / 13, "", {
            fontSize: '80px',
            color: '#000',
            fontFamily: 'Arial'
        }).setOrigin(0.5)

        //Seccion de soluciones
        for (let i = 0; i < this.nSoluciones; i++) {

            const numero = this.add.image((i+1) * this.sys.game.config.width / 4, 3 * this.sys.game.config.height / 4, "tecla").setOrigin(0.5,1);
            numero.setInteractive();
            numero.valor = 0
            numero.tipo="numero"
            this.listaSoluciones.push(numero)
        } 

    }

    generarOperacion() {
        this.textSoluciones.clear(true,true)
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
                var num1 = Phaser.Math.Between(1, 10);
                var num2 = Phaser.Math.Between(2, 10);
                this.solucion = num1 * num2;
                break;
        }

        const fontSize = Math.min(this.sys.game.scale.width * 0.05, this.sys.scale.height * 0.05);
        const textStyle = { font: `${fontSize}px Arial`, fill: '#ffffff' };

        // Crea el texto en el centro de la pantalla
        this.operador1.setText(num1, textStyle).setOrigin(0.5);
        this.operador2.setText(num2, textStyle).setOrigin(0.5);
        this.operacion.setText(operador, textStyle).setOrigin(0.5);

        var posiblesSoluciones = [this.solucion]
        for (let i = 1; i < this.nSoluciones; i++) {
            var numeroAleatorio = Math.floor(Math.random() * (this.solucion + 21));
            while(numeroAleatorio==this.solucion){
                numeroAleatorio = Math.floor(Math.random() * (this.solucion + 21));
            }
            posiblesSoluciones.push(numeroAleatorio)
        }
        Phaser.Utils.Array.Shuffle(posiblesSoluciones);
        
        for (let i = 0; i < this.nSoluciones; i++) {
            var texto = this.add.text((i+1) * this.sys.game.config.width / 4, 3 * this.sys.game.config.height / 4, posiblesSoluciones[i], { fontFamily: 'Arial', fontSize: 65, color: '#000000' });
            texto.setPosition( this.listaSoluciones[i].x - texto.width / 2,  this.listaSoluciones[i].y -  this.listaSoluciones[i].height / 2 - texto.height / 2);
            this.listaSoluciones[i].valor= posiblesSoluciones[i]
            this.textSoluciones.add(texto)
        }
    }

    async verificarRespuesta(respuesta) {
        if (parseInt(respuesta) === this.solucion) {
            this.puntuacion++;
            this.cubrirResultado(true)
        } else {
            this.fallos++;
            this.cubrirResultado(false)
        }
        this.time.delayedCall(1000,  this.generarOperacion, [], this);
    
    }

    async update(){
        if(this.rondas_actuales==this.RONDAS_TOTALES){
            await this.esperar(900)
            this.finalizarJuego()
        }
    }

    esperar(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    finalizarJuego() {
        var fechaFin = new Date();
        var tiempoTranscurrido = fechaFin - this.fechaInicio
        const minutos = Math.floor(tiempoTranscurrido / 60000);
        const segundos = parseInt(((tiempoTranscurrido % 60000) / 1000).toFixed(0));

        this.scene.start("scene_fin",
              {
                aciertos: this.puntuacion,
                fallos: this.fallos,
                idJuego: this.idJuego,
                fechaInicio: this.fechaInicio,
                duracion: { minutos, segundos },
                segundos: minutos * 60 + segundos,
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
            duration: 1400,
            ease: 'Linear',
            onComplete: () => {
                cover.destroy();
            }
        });
    }

}
