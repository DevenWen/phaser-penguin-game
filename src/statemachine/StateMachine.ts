interface StateConfig
{
    name?: string
    onEnter?: () => void
    onUpdate?: (dt: number) => void
    onExit?: () => void
}


export default class StateMachine
{

    private context?: any
    private name: string
    private states = new Map<string, StateConfig>()

    private currentState?: StateConfig

    constructor(context?: any, name?: string)
    {
        this.context = context
        this.name = name || "default"
    }

    isCurrentState(name: string)
    {
        if (!this.currentState)
        {
            return false
        }
        return this.currentState.name === name
    }

    addState(name: string, config?: StateConfig)
    {
        this.states.set(name, {
            name,
            onEnter: config?.onEnter?.bind(this.context),
            onUpdate: config?.onUpdate?.bind(this.context),
            onExit: config?.onExit?.bind(this.context)
        })
        return this
    }

    setState(name: string)
    {
        if (!this.states.has(name))
        {
            return
        }

        if (this.currentState && this.currentState.onExit)
        {
            this.currentState.onExit()
        }

        this.currentState = this.states.get(name)!
        if (this.currentState.onEnter)
        {
            this.currentState.onEnter()
        }
    }

    update(dt: number)
    {
        if (!this.currentState)
        {
            return
        }

        if (this.currentState.onUpdate)
        {
            this.currentState.onUpdate(dt)
        }
    }
}