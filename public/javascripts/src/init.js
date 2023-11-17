import Bootloader from "./scenes_pong/bootloader.js"
import scene_play from "./scenes_pong/scenes/scene_play.js"
import scene_pong from "./scenes_pong/scenes/scene_pong.js"

export function arranque(idJuego) {
    const config = {
        type: Phaser.AUTO,
        width: contJuego.clientWidth,  // Usa el ancho del contenedor
        height: contJuego.clientHeight,  // Usa la altura del contenedor
        parent: "contJuego",
        physics: {
            default: "arcade"
        },
        transparent: true
    };

    if(idJuego =="1"){
        config.scene = [Bootloader, scene_play, scene_pong]
    }else if(idJuego =="2"){
        config.scene = [Bootloader, scene_play, scene_pong]
    }
    var game = new Phaser.Game(config)
   
}


