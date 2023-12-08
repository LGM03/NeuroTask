import Bootloader from "./bootloader.js"
import scene_play from "./scenes/scene_play.js"
import scene_pong from "./scenes/scene_pong.js"
import scene_fin from "./scenes/scene_fin.js";
import scene_cuentas from "./scenes/scene_cuentas.js";
import scene_parejas from "./scenes/scene_parejas.js";
import scene_ordenCreciente from "./scenes/scene_ordenCreciente.js";

let juego

export function arranque(idJuego) {
    juego = idJuego
    const config = {
        type: Phaser.AUTO,
        width: contJuego.clientWidth,  // Usa el ancho del contenedor
        height: contJuego.clientHeight,  // Usa la altura del contenedor
        parent: "contJuego",
        physics: {
            default: "arcade"
        },
        transparent: true,
        scale: {
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
            mode: Phaser.Scale.FIT,
            min: {
                width: 328,
                height: 188
            },
            max: {
                width: 1312,
                height: 752
            },
            zoom: 1
        }
    };

    if (idJuego == "1") { //Juego del Pong
        config.scene = [inicio, Bootloader, scene_play, scene_pong, scene_fin] //TODO
    } else if (idJuego == "2") { //Juego Cuentas
        config.scene = [inicio, Bootloader, scene_play, scene_cuentas, scene_fin]
    } else if (idJuego == "3") { //Juego Emparejar
        config.scene = [inicio, Bootloader, scene_play, scene_parejas, scene_fin]
    }else if (idJuego == "4") { //Juego Ordenar de Mayor a Menor
        config.scene = [inicio, Bootloader, scene_play, scene_ordenCreciente, scene_fin]
    }
    var game = new Phaser.Game(config)
    game.canvas.style.borderRadius = '10px';
}

export default class inicio extends Phaser.Scene { //escena que llama al bootloader y le pasa el id del juego correspondiente
    constructor() {
        super({ key: "inicio" });
    }

    preload() {
        console.log("inicio + " + juego)
        this.scene.start("Bootloader", { idJuego: juego })
    }
}



