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
let infoPlan

export function iniciarJuego(idJuego) {
    if (idJuego == -1) {
        obtenerPlan()
    } else {
        arranque(idJuego)
    }
}

export function obtenerPlan() {

    $.ajax({ // veo para cada dia que actividades hay
        method: "GET",
        url: "/tareas/tareaPrimera",
        success: function (datos, state, jqXHR) {
            if (datos.length == 0) {
                $("#ventanaMensaje").removeClass('d-none')
                $("#imgMensaje").attr("src","/images/felicitacion1.png")
                $("#imgMensaje").attr("alt","Felicidades, has terminado tu planificación")
                
                $("#imgMensaje").css("max-width","75%")

                setTimeout(async () => {
                    window.location.href = `/`
                }, 3000);
               
            } else {
                juego = datos[0].idJuego

                arranque(datos[0].idJuego, {
                    idTarea: datos[0].idTarea,
                    nivel: datos[0].nivel
                })
            }
        },
        error: function (jqXHR, statusText, errorThrown) {
            window.location.href = `/`
        }
    });
}
export function arranque(idJuego, planJuegos = null) {

    juego = idJuego
    infoPlan = planJuegos

    const config = {
        type: Phaser.AUTO,
        width: 1950,  // Usa el ancho del contenedor
        height: 900,  // Usa la altura del contenedor
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
                width: 1950,
                height: 900
            },
            zoom: 1
        }
    };

    config.scene = [inicio, Bootloader, scene_dificultad, scene_play] 
    if (idJuego == "1") { //Juego del Pong
        config.scene.push(scene_pong)
    } else if (idJuego == "2") { //Juego Cuentas
        config.scene.push(scene_cuentas)
    } else if (idJuego == "3") { //Juego Emparejar
        config.scene.push(scene_parejas)
    } else if (idJuego == "4") { //Juego Ordenar de Mayor a Menor
        config.scene.push(scene_ordenCreciente)
    } else if (idJuego == "5") {
        config.scene.push(scene_anagramas)
    } else if (idJuego == "6") {
        config.scene.push(scene_refranes)
    } else if (idJuego == "7") {
        config.scene.push(scene_simonDice)
    } else if (idJuego == "8") {
        config.scene.push(scene_ordenDecreciente)
    } else if (idJuego == "9") {
        config.scene.push(scene_memorizaFiguras)
    } else if (idJuego == "10") {
        config.scene.push(scene_memorizaColores)
    }
    config.scene.push(scene_fin)
    var game = new Phaser.Game(config)
    game.canvas.style.borderRadius = '10px';

}

export default class inicio extends Phaser.Scene { //escena que llama al bootloader y le pasa el id del juego correspondiente
    constructor() {
        super({ key: "inicio" });
    }

    preload() {
        this.scene.start("Bootloader", { idJuego: juego, plan: infoPlan })
    }
}



