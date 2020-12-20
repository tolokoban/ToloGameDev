import * as React from "react"
import SimpleTri from './simple-tri'
import ColorTri from './color-tri'
import Draw from '../../view/draw'

import './intro-view.css'


export interface IIntroViewProps {
    className?: string
}

// tslint:disable-next-line: no-empty-interface
interface IIntroViewState { }

export default class IntroView extends React.Component<IIntroViewProps, IIntroViewState> {
    private refCanvas1 = React.createRef<HTMLCanvasElement>()
    private refCanvas2 = React.createRef<HTMLCanvasElement>()
    private refCanvas3 = React.createRef<HTMLCanvasElement>()
    state: IIntroViewState = {}

    componentDidMount() {
        const canvas1 = this.refCanvas1.current
        const canvas2 = this.refCanvas2.current
        const canvas3 = this.refCanvas3.current
        if (!canvas1 || !canvas2 || !canvas3) return

        SimpleTri.paint(canvas1, false)
        SimpleTri.paint(canvas2, true)
        ColorTri.paint(canvas3)
    }

    render() {
        const classNames = ['custom', 'page-IntroView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <article className={classNames.join(" ")}>
            <header>WebGL Fundamentals</header>
            <h1>Coordinates System</h1>
            {
                Draw.create()
                    .axis()
                    .render()
            }
            <div>Drawing a triangle with only one attribute...</div>
            <figure>
                <canvas className="preview" ref={this.refCanvas1}></canvas>
                <div>antialias = false</div>
            </figure>
            <figure>
                <canvas className="preview" ref={this.refCanvas2}></canvas>
                <div>antialias = true</div>
            </figure>
            <div>Drawing a triangle with two attributes...</div>
            <figure>
                <canvas className="preview" ref={this.refCanvas3}></canvas>
                <div><code>attPoint</code> and <code>attColor</code></div>
            </figure>
        </article>
    }
}
