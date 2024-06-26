
//Como accedo desde aqui a la BD, require no funciona y los import tampoco

export default class scene_play extends Phaser.Scene {

    constructor() {
        super({ key: "scene_play" });
    }

    init(data) {
        this.info = {  //Recojo los parametros traidos de quien inicia la escena 
            descripcion: data.descripcion,
            juego: data.juego,
            idJuego: data.idJuego,
            nivel: data.nivel,
            plan: data.plan
        }
    }

    create() {
        const self = this
        $('#ventanaInicio').removeClass("d-none")
        $("#introduccion").text(this.info.descripcion)

        $("#btnInicio").on("click", function (event) { //Escena de inicio muestra la descripcion del juego
            event.preventDefault()
            $('#ventanaInicio').addClass("d-none");
            self.scene.start(self.info.juego, { idJuego: self.info.idJuego, nivel: self.info.nivel, plan: self.info.plan });
        })
    }

}    