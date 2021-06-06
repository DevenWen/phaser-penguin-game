import Phaser from 'phaser'
import { AnimationComponent } from '~/components/AnimationComponent'
import { ClickOnMeComponent } from '~/components/ClickOnMeComponent'
import ComponentService from '~/components/ComponentService'
import MoveComponent from '~/components/MoveComponent'

export default class Game extends Phaser.Scene
{
    private penguin?: Phaser.Physics.Matter.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private components!: ComponentService

    constructor()
    {
        super("game")
    }

    init()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.components = new ComponentService()

        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.components.destroy()
        })
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

        const objectsLayer = map.getObjectLayer('objects')
        objectsLayer.objects.forEach(objData => {
            const {x = 0, y = 0, name, width = 0} = objData

            switch(name)
            {
                case 'penguin-spwan':
                {
                    this.penguin = this.matter.add.sprite(x + (width * 0.5), y, 'penguin').setFixedRotation()

                    this.components.addComponent(this.penguin, new AnimationComponent())
                    this.components.addComponent(this.penguin, new MoveComponent(this.cursors))
                    this.components.addComponent(this.penguin, new ClickOnMeComponent())
                    this.cameras.main.startFollow(this.penguin)
                    break
                }
            }
        })

    }

    update(t: number, dt: number)
    {
        this.components.update(dt)
    }


}