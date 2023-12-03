
export default class scene_parejas extends Phaser.Scene {

    constructor() {
        super({ key: "scene_parejas" });
        this.fechaInicio = new Date();
        this.seleccionadas = [];
        this.valores = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
        this.puntuacion = 0
    }

    init(data) {
        this.idJuego = data.idJuego
    }

    create() {
        const MS = 1000
        this.duracion = 60  //en segundos
        // this.time.delayedCall(this.duracion * MS , this.finalizarJuego, [], this);

        this.aciertos = 0;
        this.fallos = 0;

        // Coordenadas iniciales para ls cartas
        var startX = 100;
        var startY = 100;
        var cardWidth = 80;
        var cardHeight = 120;

        Phaser.Utils.Array.Shuffle(this.valores); //Los mezclo     

        var grupo = this.add.group();
        var startX = this.game.config.width * 0.1; // 10% del ancho de la pantalla
        var startY = this.game.config.height * 0.2; // 20% del alto de la pantalla
        var cardWidth = this.game.config.width * 0.1; // 10% del ancho de la pantalla
        var cardHeight = this.game.config.height * 0.15; // 15% del alto de la pantalla

        // Crear cartas en un bucle
        for (var i = 0; i < this.valores.length; i++) {
            var carta = this.crearCarta(i, startX + i * (cardWidth + 20), startY, cardWidth, cardHeight, this.valores[i]);
            grupo.add(carta);
        }

        // Detectar clics en las cartas
        this.input.on('gameobjectdown', function (pointer, gameObject) {
            console.log('Carta clickeada' + gameObject.index)
        });
    }

    crearCarta(index, x, y, width, height, value) {
        var card = this.add.image(x,y, "card"); 
        card.setScale(0.7)
        card.setInteractive();  
        card.index = index;
        card.value = value;

        // Texto para mostrar el valor de la carta (temporal)
        card.text = this.add.text(x - width / 2 + 10, y - height / 2 + 10, '', { fontSize: '16px', fill: '#fffFFFF' });
        card.text.setText(value);
        card.text.visible = false;

        // Agrega el evento 'pointerdown' solo una vez durante la creación de la carta
        card.on('pointerdown', (pointer, gameObject) => {
            console.log('Carta clickeada: ' + gameObject.index);
            card.text.visible = true;
            this.seleccionadas.push(card);  // Cambia gameObject por card

            // Si hay dos cartas seleccionadas, verificar si coinciden
            console.log(this.seleccionadas)
            if (this.seleccionadas.length === 2) {
                this.time.delayedCall(500, () => {
                    if (this.seleccionadas[0].value === this.seleccionadas[1].value) {
                        console.log("iguales");
                        this.puntuacion += 1;
                    } else {
                        console.log("distintas");
                        this.seleccionadas[0].text.visible = false;  // Oculta el texto de la primera carta
                        this.seleccionadas[1].text.visible = false;
                    }
                    this.seleccionadas = [] //Vacio la lista
                });
            }
        });

        return card;
    }

    update(time, delta) {
        if(this.puntuacion === this.valores.length/2){ //Cuando ya he encontrado todas Salida

        }
    }


    finalizarJuego() {

        // Por ejemplo, puedes cambiar a otra escena
        this.scene.start("scene_fin",
            {
                aciertos: this.aciertos,
                fallos: this.fallos,
                idJuego: this.idJuego,
                fechaInicio: this.fechaInicio,
                duracion: this.duracion
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