
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

    create() { //Creo una ventana con las opciones de dificultad

        $('#ventanaDificultad').removeClass('d-none')

        const self  = this
        // Asignar un evento de clic al botón
        $('#ventanaDificultad').on("click",".btnDificultad",function(event){

            $('#ventanaDificultad').addClass('d-none')
            self.info.nivel = $(this).data("nivel")
            self.scene.start("scene_play", self.info);
        })
    }

}    