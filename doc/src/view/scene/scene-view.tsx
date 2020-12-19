import * as React from "react"
import App from '../../app'


import './scene-view.css'

export interface ISceneViewProps {
    className?: string
}

// tslint:disable-next-line: no-empty-interface
interface ISceneViewState { }

export default class SceneView extends React.Component<ISceneViewProps, ISceneViewState> {
    private refCanvas = React.createRef<HTMLCanvasElement>()
    state: ISceneViewState = {}

    componentDidMount() {
        const canvas = this.refCanvas.current
        if (!canvas ) return

        App.start(canvas)
    }

    render() {
        const classNames = ['custom', 'view-SceneView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <canvas ref={this.refCanvas} className={classNames.join(" ")}>
        </canvas>
    }
}
