export default class obstaculo extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,type){
        super(scene,x,y,type)
        scene.add.existing(this) //Cuando se cree este objeto, lo hace existente en el plano
        scene.physics.world.enable(this) //Le doy fisicas
        this.body.immovable=true  //Para que con las colisiones las cosas no se arrastren
        this.body.setCollideWorldBounds(true)
    
    }
}

