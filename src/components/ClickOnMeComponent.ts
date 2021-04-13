import { IComponent } from "./ComponentService";

export class ClickOnMeComponent implements IComponent
{
    private gameObject!: Phaser.GameObjects.GameObject

    init(go: Phaser.GameObjects.GameObject) 
    {
        this.gameObject = go
        console.log(`init component ${go.name}`)
    }
    awake() 
    {
        console.log("awake")
    }

    start()
    {
        console.log("start")
        this.gameObject
            .setInteractive()
            .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, this.handleClick, this)
    }

    private handleClick() 
    {
        console.log(`clicked on ${this.gameObject.name}`)
    }


    update?: ((dt: number) => void) | undefined;
    destroy?: (() => void) | undefined;
    
}
