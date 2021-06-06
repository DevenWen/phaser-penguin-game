import { IComponent } from "./ComponentService";


export class AnimationComponent implements IComponent
{
    private sprite!: Phaser.Physics.Matter.Sprite

    init(sprite: Phaser.Physics.Matter.Sprite)
    {
        this.sprite = sprite
        this.sprite.anims.create({
            key: "player-idle",
            frames:[
                {
                    key: 'penguin',
                    frame: 'penguin_walk01.png'
                }
            ]
        })

        this.sprite.anims.create({
            key: 'player-jump',
            frameRate: 20,
            frames: this.sprite.anims.generateFrameNames('penguin', {
                start: 1,
                end: 3,
                prefix: 'penguin_jump0',
                suffix: '.png'
            }),
            repeat: 0
        })

        this.sprite.anims.create({
            key: 'player-walk',
            frameRate: 10,
            frames: this.sprite.anims.generateFrameNames('penguin', {
                start: 1,
                end: 4,
                prefix: 'penguin_walk0',
                suffix: '.png'
            }),
            repeat: -1
        })

        this.sprite.anims.create({
            key: 'player-slide',
            frameRate: 20,
            frames: this.sprite.anims.generateFrameNames('penguin', {
                start: 1, 
                end: 2,
                prefix: 'penguin_slide0',
                suffix: '.png'
            }),
            repeat: 0
        })
        

    }


}