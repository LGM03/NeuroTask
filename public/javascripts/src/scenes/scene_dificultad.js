
//Como accedo desde aqui a la BD, require no funciona y los import tampoco

export default class scene_dificultad extends Phaser.Scene {

    constructor() {
        super({ key: "scene_dificultad" });
    }

    init(data) {

        this.info = {  //Recojo los parametros traidos de quien inicia la escena 
            descripcion: data.descripcion,
            juego: data.juego,
            idJuego: data.idJuego,
            plan : data.plan
        }
    }

    create() {

        $('#ventanaDificultad').removeClass('d-none')

        const self  = this
        // Asignar un evento de clic al botón
        $('#ventanaDificultad').on("click",".btnDificultad",function(event){

            $('#ventanaDificultad').addClass('d-none')
            console.log(self.info)
            self.info.nivel = $(this).data("nivel")
            console.log(self.info)
            self.scene.start("scene_play", self.info);
        })
    }

}    