import bootloader from "./bootloader.js"
import scene_play from "./scenes/scene_play.js"
import scene_pong from "./scenes/scene_pong.js";

const config = {
    type: Phaser.AUTO,
    width: contJuego.clientWidth,  // Usa el ancho del contenedor
    height: contJuego.clientHeight,  // Usa la altura del contenedor
    parent: "contJuego",
    physics: {
        default: "arcade"
    },
    scene: [bootloader, scene_play, scene_pong],
    transparent: true
   
};

var game = new Phaser.Game(config)

