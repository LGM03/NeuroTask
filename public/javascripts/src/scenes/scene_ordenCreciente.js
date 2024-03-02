
export default class scene_ordenCreciente extends Phaser.Scene {

    constructor() {
        super({ key: "scene_ordenCreciente" });
        this.fechaInicio = new Date();
        this.seleccionadas = [];
        this.valores = ["cartaSol", "cartaMelon", "cartaCalavera", "cartaJarra", "cartaPez", "cartaBota", "cartaBarril", "cartaCampana", "cartaCorazon", "cartaBotella", "cartaSandia", "cartaParaguas"];
        this.cartas = { "cartaSol": 17, "cartaMelon": 18, "cartaCalavera": 19, "cartaJarra": 20, "cartaPez": 21, "cartaBota": 22, "cartaBarril": 41, "cartaCampana": 42, "cartaCorazon": 43, "cartaBotella": 44, "cartaSandia": 45, "cartaParaguas": 46 }
        this.puntuacion = 0;
        this.ordenValido = [17, 18, 19, 20, 21, 41, 42, 43, 44, 45, 46]

        this.fallos = 0;
    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
        this.plan = data.plan

        if (this.plan != null) {
            this.nivel = this.plan.nivel
        }
    }

    create() {
        $("#ventanaOrden").removeClass("d-none")
        $("#textoOrden").text("Ordena de MENOR a MAYOR")

        Phaser.Utils.Array.Shuffle(this.valores);

        // Crear cartas en un bucle
        for (var i = 0; i < this.valores.length; i++) {
            var nuevaCarta = $("<div class='carta col-lg-3 col-md-3 col-4 d-flex justify-content-around align-items-center ' id = "+ this.valores[i]+ " data-valor = "+ this.cartas[this.valores[i]]+" ><img src='/javascripts/assets/" +this.valores[i]  + ".png' alt='"+this.valores[i]+"' class = 'img-fluid'></div>");
            // Agregamos el nuevo div al contenedor
            $("#contenedorCartas").append(nuevaCarta);
        }

        // Detectar clics en las cartas
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            console.log('Carta clickeada ' + gameObject.value)
            console.log(this.ordenValido[this.puntuacion])
            if (gameObject.value === this.ordenValido[this.puntuacion]) {
                this.cubrirCartaCorrecta(gameObject)
                this.puntuacion++;
            } else {
                this.cubrirCartaErronea(gameObject)
                this.fallos++;

            }
        });
    }

    crearCarta(index, x, y, value) {
        var card = this.add.image(x, y, value);
        card.setScale(0.3);
        card.setOrigin(0, 0)
        card.setInteractive();
        card.index = index;
        card.value = this.cartas[value];
        return card;
    }


    cubrirCartaCorrecta(carta) {
        const scaleX = carta.scaleX;
        const scaleY = carta.scaleY;

        const cover = this.add.rectangle(carta.x, carta.y, carta.width * scaleX, carta.height * scaleY, 0x00FF00, 0.5);
        cover.setOrigin(0, 0);

        this.tweens.add({
            targets: cover,
            alpha: 0,
            duration: 2000,
            ease: 'Linear',
            onComplete: () => {
                cover.destroy();
            }
        });
    }

    cubrirCartaErronea(carta) {
        const scaleX = carta.scaleX;
        const scaleY = carta.scaleY;

        const cover = this.add.rectangle(carta.x, carta.y, carta.width * scaleX, carta.height * scaleY, 0xFF0000, 0.5);
        cover.setOrigin(0, 0);

        this.tweens.add({
            targets: cover,
            alpha: 0,
            duration: 2000,
            ease: 'Linear',
            onComplete: () => {
                cover.destroy();
            }
        });
    }


    update(time, delta) {
        console.log(this.puntuacion + " " + this.valores.length)

        if (this.puntuacion === this.valores.length - 1) { //Cuando ya he encontrado todas Salida
            this.finalizarJuego()
        }
    }


    finalizarJuego() {
        var fechaFin = new Date();
        var tiempoTranscurrido = fechaFin - this.fechaInicio
        const minutos = Math.floor(tiempoTranscurrido / 60000);
        const segundos = ((tiempoTranscurrido % 60000) / 1000).toFixed(0);
        // Por ejemplo, puedes cambiar a otra escena
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



}


/*OPERACIONES VARIAS CON ESCENAS:
    this.scene.bringToTop(z ) -> Mueve la escena z delante del todo
    this.scene.sendToBack(z) -> Mueve la escena z atrás del todo
    this.scene.moveUp(z) -> Mueve la escena z una posicion hacia delante
    this.scene.moveDown(z) ->Mueve la escena z una posicion hacia atras
    this.scene.moveAbove(z,w) -> Mueve la escena w encima de una escena  z indicada
    this.scene.moveBelow(z,w) -> Mueve la escena  w detras de una escena z indicada 
*/


/*estilos del tecxto 
        color : 'HEX'
        backgroundColor : 'HEX'
        fontSize : px
        padding:{
            top:
            bottom:
            left:
            right:
        }
        
        
        */ 