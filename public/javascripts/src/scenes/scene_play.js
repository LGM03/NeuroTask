
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

        $("#btnInicio").on("click", function (event) {
            event.preventDefault()
            $('canvas').css('z-index', '2');
            $('#ventanaInicio').css('z-index', '1');
            $('#ventanaInicio').addClass("d-none");
            self.scene.start(self.info.juego, { idJuego: self.info.idJuego, nivel: self.info.nivel, plan: self.info.plan });
        })
    }

}    