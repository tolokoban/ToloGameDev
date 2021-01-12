import * as React from "react"
import * as TGD from 'tolo-game-dev'

import './abstract-scene-view.css'

export interface IAbstractSceneViewProps {
    className?: string
}

export default abstract class AbstractSceneView extends React.Component<IAbstractSceneViewProps> {
    private readonly refCanvas = React.createRef<HTMLCanvasElement>()
    private animating = false
    private animatable = false
    private scene: TGD.Scene

    async componentDidMount() {
        const canvas = this.refCanvas.current
        if (!canvas) return

        const scene = new TGD.Scene(canvas)
        this.scene = scene

        const animatable = await this.initialize(scene)
        this.animatable = animatable
        if (!animatable) return

        this.start()
    }

    start() {
        this.animating = true
        window.requestAnimationFrame(this.paintNextFrame)
    }

    private readonly paintNextFrame = (time: number) => {
        if (this.animating) window.requestAnimationFrame(this.paintNextFrame)
        try {
            this.anim(this.scene, time)
        } catch (ex) {
            console.error("Animation has thrown an exception, therefore it has been stopped!")
            console.error(ex)
            this.animating = false
        }
    }

    /**
     * This is the place where to load all the assets,
     * create all programs, buffers, textures, etc.
     *
     * @param scene Superset of the current WebGL context.
     * @returns `true` if this is an animation.
     */
    abstract initialize(scene: TGD.Scene): Promise<boolean>

    /**
     * This function is called at every frame since the animation is ON.
     *
     * @param scene Superset of the current WebGL context.
     * @param time Time in milliseconds from the start of the animation.
     */
    abstract anim(scene: TGD.Scene, time: number)

    render() {
        const classNames = ['custom', 'view-AbstractSceneView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <canvas ref={this.refCanvas} className={classNames.join(" ")}>
        </canvas>
    }
}
