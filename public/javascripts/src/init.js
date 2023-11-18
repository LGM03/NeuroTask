import Bootloader from "./scenes_pong/bootloader.js"
import scene_play from "./scenes_pong/scenes/scene_play.js"
import scene_pong from "./scenes_pong/scenes/scene_pong.js"
import scene_fin from "./scenes_pong/scenes/scene_fin.js";

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
        config.scene = [Bootloader, scene_play, scene_pong, scene_fin] //TODO
    }else if(idJuego =="2"){
        config.scene = [Bootloader, scene_play, scene_pong, scene_fin]
    }
    var game = new Phaser.Game(config)
   
}


