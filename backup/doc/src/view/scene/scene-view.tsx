/**
 * Easy to use scene animator
 */

import * as React from "react"
import * as TGD from 'tolo-game-dev'

import './scene-view.css'

export class IScene extends TGD.Scene { }

export interface ISceneViewProps<T> {
    className?: string
    width?: number
    height?: number
    onInit(scene: IScene): T
    onAnim?(time: number, scene: IScene, runtime: T): void
}

export default class SceneView<T = undefined> extends React.Component<ISceneViewProps<T>> {
    private refCanvas = React.createRef<HTMLCanvasElement>()
    private scene?: IScene
    private runtime: T | null

    componentDidMount() {
        const canvas = this.refCanvas.current
        if (!canvas) return

        try {
            const { onInit, onAnim } = this.props
            const scene = new TGD.Scene(canvas)
            this.scene = scene
            this.runtime = onInit(scene)
            if (typeof onAnim === 'function') {
                window.requestAnimationFrame(this.anim)
            }
        } catch (ex) {
            console.error("Unable to initialize Scene!", ex)
        }
    }

    private readonly anim = (time: number) => {
        const { scene, runtime, props } = this
        if (!scene || runtime === null) return

        const { onAnim } = props
        if (typeof onAnim !== 'function') return

        try {
            onAnim(time, scene, runtime)
            window.requestAnimationFrame(this.anim)
        } catch (ex) {
            console.error("Animation will stop because of an exception!", ex)
        }
    }

    render() {
        const { width, height, className } = this.props
        const classNames = ['custom', 'view-SceneView']
        if (typeof className === 'string') {
            classNames.push(className)
        }
        const style: React.CSSProperties = {}
        if (typeof width === 'number') {
            style.width = `${width}px`
        }
        if (typeof height === 'number') {
            style.height = `${height}px`
        }

        return <canvas
            ref={this.refCanvas}
            className={classNames.join(" ")}
            width={width}
            height={height}
            style={style}
        >
        </canvas>
    }
}
