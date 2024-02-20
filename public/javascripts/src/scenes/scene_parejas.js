
export default class scene_parejas extends Phaser.Scene {

    constructor() {
        super({ key: "scene_parejas" });
        this.fechaInicio = new Date();
        this.seleccionadas = [];
        this.valores = ["sol", "sol", "melon", "melon", "calavera", "calavera", "jarra", "jarra", "pez", "pez", "bota", "bota"];
        this.puntuacion = 0
        this.seleccionables = true; // Variable de estado
        this.fallos = 0;
    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
    }

    create() {
        this.fondo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "fondoRosa") //imagen de fondo
        this.fondo.setScale(0.5)
        Phaser.Utils.Array.Shuffle(this.valores); //Los mezclo     

        var grupo = this.add.group();
        var startX = this.game.config.width / 7; // 10% del ancho de la pantalla
        var startY = 30; // 20% del alto de la pantalla

        // Crear cartas en un bucle
        for (var i = 0; i < this.valores.length; i++) {
            if (i > 5) {
                startY = this.game.config.height / 2 + 30
                var carta = this.crearCarta(i, 70 + (i - 6) * (startX + 20), startY, this.valores[i]);
            } else {
                var carta = this.crearCarta(i, 70 + i * (startX + 20), startY, this.valores[i]);
            }

            grupo.add(carta);
        }
    }

    crearCarta(index, x, y, value) {
        var card = this.add.image(x, y, "card");
        card.setScale(0.7);
        card.setOrigin(0, 0)
        card.setInteractive();
        card.index = index;
        card.value = value;

        // Agrega el evento 'pointerdown' solo una vez durante la creación de la carta
        card.on('pointerdown', (pointer, gameObject) => {
            if (this.seleccionables) {
                const displayWidth = card.displayWidth;
                const displayHeight = card.displayHeight;
                card.setTexture(this.valores[card.index])
                card.setDisplaySize(displayWidth, displayHeight);

                this.seleccionadas.push(card);  // Cambia gameObject por card

                // Si hay dos cartas seleccionadas, verificar si coinciden

                if (this.seleccionadas.length === 2) {
                    this.seleccionables=false;
                    this.time.delayedCall(600, () => {
                        if (this.seleccionadas[0].value === this.seleccionadas[1].value) {
                            this.cubrirCartaCorrecta(this.seleccionadas[0])
                            this.cubrirCartaCorrecta(this.seleccionadas[1])
                            this.puntuacion += 1;
                        } else {
                            this.fallos ++ ;
                            this.cubrirCartaErronea(this.seleccionadas[0])
                            this.cubrirCartaErronea(this.seleccionadas[1])
                            this.seleccionadas[0].setTexture("card")// Oculta el texto de la primera carta
                            this.seleccionadas[0].setDisplaySize(displayWidth, displayHeight);
                            this.seleccionadas[1].setTexture("card")
                            this.seleccionadas[1].setDisplaySize(displayWidth, displayHeight);
                        }
                        this.seleccionadas = [] //Vacio la lista
                        this.seleccionables = true
                    });
                }
            }
        });

        return card;
    }

    update(time, delta) {

        console.log(this.puntuacion + " "+ this.fallos)
        if (this.puntuacion === this.valores.length / 2) { //Cuando ya he encontrado todas Salida
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
                fallos : this.fallos,
                idJuego: this.idJuego,
                fechaInicio: this.fechaInicio,
                duracion: { minutos, segundos },
                segundos :minutos*60+segundos,
                nivel : this.nivel
            });
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