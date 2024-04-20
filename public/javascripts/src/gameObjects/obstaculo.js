export default class Palas extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,type){
        super(scene,x,y,type)
        scene.add.existing(this) //Cuando se cree este objeto, lo hace existente en el plano
        scene.physics.world.enable(this) //Le doys fisicas a todos los tipo Pala
        this.body.immovable=true  //Para que la pelota no arrastre a la pala al chocar 
        this.body.setCollideWorldBounds(true)
    
    }
}

