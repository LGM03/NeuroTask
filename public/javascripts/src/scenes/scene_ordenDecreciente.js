
export default class scene_ordenDecreciente extends Phaser.Scene {

    constructor() {
        super({ key: "scene_ordenDecreciente" });
        this.fechaInicio = new Date();
        this.seleccionadas = [];
        this.valores = ["sol", "melon", "calavera", "jarra","pez", "bota","barril","campana","corazon","botella","sandia","paraguas"];
        this.cartas = {"sol": 17,"melon": 18, "calavera":19, "jarra":20,"pez":21, "bota":22,"barril":41,"campana":42,"corazon":43,"botella":44,"sandia":45,"paraguas":46 }
        this.puntuacion = 0;
        this.ordenValido = [46,45,44,43,42,41,22,21,20,19,18,17]
        this.fallos = 0;
    }

    init(data) {
        this.idJuego = data.idJuego
        this.nivel = data.nivel
        this.plan = data.plan

        if(this.plan != null){
            this.nivel = this.plan.nivel
        }
    }

    create() {
        this.fondo = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, "fondoRosa") //imagen de fondo
        this.fondo.setScale(0.5)
        Phaser.Utils.Array.Shuffle(this.valores);   

        var grupo = this.add.group();
        var startX = this.game.config.width / 7;
        var startY = 30; 

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

        // Detectar clics en las cartas
        this.input.on('gameobjectdown', (pointer, gameObject) => {
            console.log('Carta clickeada ' + gameObject.value)
            console.log(this.ordenValido[this.puntuacion])
            if(gameObject.value === this.ordenValido[this.puntuacion]){
                this.cubrirCartaCorrecta(gameObject) 
                this.puntuacion++;
            }else{
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
        console.log(this.puntuacion + " "+ this.valores.length)

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
                fallos : this.fallos,
                idJuego: this.idJuego,
                fechaInicio: this.fechaInicio,
                duracion: { minutos, segundos },
                segundos : minutos*60+segundos,
                nivel : this.nivel,
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