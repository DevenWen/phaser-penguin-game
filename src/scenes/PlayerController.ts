import Phaser from 'phaser'
import StateMachine from '../statemachine/StateMachine'

export default class PlayerController
{
    private sprite: Phaser.Physics.Matter.Sprite
    private stateMachine: StateMachine
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys

    constructor(sprite: Phaser.Physics.Matter.Sprite, cursors: Phaser.Types.Input.Keyboard.CursorKeys)
    {
        this.sprite = sprite
        this.cursors = cursors
        this.stateMachine = new StateMachine(this, "player")
        this.createAnimation()

        this.stateMachine.addState('idle', {
            onEnter: this.idleOnEnter,
            onUpdate: this.idleOnUpdate
        })
        .addState('walk', {
            onEnter: this.walkOnEnter,
            onUpdate: this.walkOnUpdate
        })
        .addState('jump', {
            onEnter: this.jumpOnEnter,
            onUpdate: this.jumpOnUpdate
        })
        .addState('slide', {
            onEnter: this.slideOnEnter,
            onUpdate: this.slideOnUpdate
        })
        .setState('idle')

        this.sprite.setOnCollide((data: MatterJS.ICollisionPair) => {
            if (this.stateMachine.isCurrentState('jump'))
            {
                this.stateMachine.setState('idle')
            }
        })
    }

    update(dt: number) 
    {
        this.stateMachine.update(dt)
    }

    private slideOnEnter() 
    {
        this.sprite.play('player-slide')
        this.sprite.setFriction(0.01)
    }

    private slideOnUpdate()
    {
        // 减速，速度为0时，恢复idle
        if (Math.abs(this.sprite.body.velocity.x) < 1) {
            this.stateMachine.setState('idle')
        }
    }

    private walkOnEnter()
    {
        this.sprite.play('player-walk')
    }

    private walkOnUpdate()
    {
        const speed = 5

        if (this.cursors.left.isDown)
        {
            this.sprite.flipX = true
            if (this.cursors.shift.isDown) {
                this.sprite.setVelocityX(-speed * 5)
                this.stateMachine.setState('slide')
            } else {
                this.sprite.setVelocityX(-speed)
            }
        }
        else if (this.cursors.right.isDown)
        {
            this.sprite.flipX = false
            if (this.cursors.shift.isDown) {
                this.sprite.setVelocityX(speed * 5)
                this.stateMachine.setState('slide')
            } else {
                this.sprite.setVelocityX(speed)
            }
        }
        else if (this.cursors.shift.isDown)
        {
            this.stateMachine.setState('slide')
        }
        else
        {
            this.sprite.setVelocityX(0)
            this.stateMachine.setState('idle')
        }

        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustPressed)
        {
            this.stateMachine.setState('jump')
        }
    }

    private jumpOnEnter() 
    {
        this.sprite.setVelocityY(-12)
        this.sprite.play('player-jump')
    }

    private jumpOnUpdate() 
    {
        const speed = 5

        if (this.cursors.left.isDown)
        {
            this.sprite.flipX = true
            this.sprite.setVelocityX(-speed)
        }
        else if (this.cursors.right.isDown)
        {
            this.sprite.flipX = false
            this.sprite.setVelocityX(speed)
        }
    }

    private idleOnEnter()   
    {
        this.sprite.play('player-idle')
    }

    private idleOnUpdate()
    {
        if (this.cursors.left.isDown || this.cursors.right.isDown)
        {
            this.stateMachine.setState('walk')
        }

        const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space)
        if (spaceJustPressed)
        {
            this.stateMachine.setState('jump')
        } 
    }

    private createAnimation()
    {
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