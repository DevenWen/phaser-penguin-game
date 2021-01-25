import Phaser from 'phaser'

export default class Game extends Phaser.Scene
{
    constructor()
    {
        super("game")
    }


    preload()
    {
        this.load.atlas('penguin', 'assets/penguin.png', 'assets/penguin.json')
        this.load.tilemapTiledJSON('tilemap', 'assets/game.json')
        this.load.image('tiles', 'assets/sheet.png')
    }

    create()
    {
        const map = this.make.tilemap({
            key: 'tilemap'
        })

        const tileset = map.addTilesetImage('iceworld', "tiles")
        const ground = map.createLayer('ground', tileset)
        ground.setCollisionByProperty({
            collides: true
        })

        this.matter.world.convertTilemapLayer(ground)

        const {width, height} = this.scale

        this.matter.add.sprite(width * 0.5, height * 0.5, 'penguin')
    }
}