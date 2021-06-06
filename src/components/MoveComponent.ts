import StateMachine from "~/statemachine/StateMachine";
import { IComponent } from "./ComponentService";

export default class MoveComponent implements IComponent
{
    private sprite!: Phaser.Physics.Matter.Sprite
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private stateMachine: StateMachine
    

    constructor(cursors: Phaser.Types.Input.Keyboard.CursorKeys) 
    {
        this.cursors = cursors
        this.stateMachine = new StateMachine(this, "player")
    }

    init(sprite: Phaser.Physics.Matter.Sprite)
    {
        console.log(`init moveComponent: ${sprite.name}`)
        this.sprite = sprite
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

    awake()
    {
        console.log("moveComponent awake")
    }

    start()
    {
        console.log("move component start")
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
        this.sprite.play('player-jump')
        this.sprite.setVelocityY(-12)
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

}