import Bootloader from "./bootloader.js"
import scene_play from "./scenes/scene_play.js"
import scene_pong from "./scenes/scene_pong.js"
import scene_fin from "./scenes/scene_fin.js";
import scene_cuentas from "./scenes/scene_cuentas.js";
import scene_parejas from "./scenes/scene_parejas.js";
import scene_ordenCreciente from "./scenes/scene_ordenCreciente.js";
import scene_anagramas from "./scenes/scene_anagramas.js";
import scene_refranes from "./scenes/scene_refranes.js";
import scene_simonDice from "./scenes/scene_simonDice.js";
import scene_ordenDecreciente from "./scenes/scene_ordenDecreciente.js";
import scene_memorizaFiguras from "./scenes/scene_memorizaFiguras.js";
import scene_memorizaColores from "./scenes/scene_memorizaCoroles.js";
import scene_dificultad from "./scenes/scene_dificultad.js";

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
        config.scene = [inicio, Bootloader, scene_dificultad, scene_play, scene_pong, scene_fin] //TODO
    } else if (idJuego == "2") { //Juego Cuentas
        config.scene = [inicio, Bootloader, scene_dificultad, scene_play, scene_cuentas, scene_fin]
    } else if (idJuego == "3") { //Juego Emparejar
        config.scene = [inicio, Bootloader, scene_dificultad, scene_play, scene_parejas, scene_fin]
    } else if (idJuego == "4") { //Juego Ordenar de Mayor a Menor
        config.scene = [inicio, Bootloader, scene_dificultad, scene_play, scene_ordenCreciente, scene_fin]
    } else if (idJuego == "5") {
        config.scene = [inicio, Bootloader, scene_dificultad, scene_play, scene_anagramas, scene_fin]
    } else if (idJuego == "6") {
        config.scene = [inicio, Bootloader, scene_dificultad, scene_play, scene_refranes, scene_fin]
    } else if (idJuego == "7") {
        config.scene = [inicio, Bootloader, scene_dificultad, scene_play, scene_simonDice, scene_fin]
    } else if (idJuego == "8") {
        config.scene = [inicio, Bootloader, scene_dificultad, scene_play, scene_ordenDecreciente, scene_fin]
    } else if (idJuego == "9") {
        config.scene = [inicio, Bootloader, scene_dificultad, scene_play, scene_memorizaFiguras, scene_fin]
    } else if (idJuego == "10") {
        config.scene = [inicio, Bootloader, scene_dificultad, scene_play, scene_memorizaColores, scene_fin]
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



