/**
 * Exercise on Fragment Shader.
 */
import * as React from "react"
import Debouncer from 'tfw/async/debouncer'
import TGD from "tolo-game-dev"
import CodeEditor from '../code-editor'
import Storage from 'tfw/storage'

import './exercise-view.css'
import Button from "tfw/view/button"

const LocalStorage = new Storage.PrefixedLocalStorage("exercise-view")
const DEBOUNCING_DELAY = 1000

export interface IExerciseViewProps {
    className?: string
    id: string
    painter(
        gl: WebGL2RenderingContext | WebGLRenderingContext,
        prg: WebGLProgram
    ): void
    // Readonly Vertex Shader Code.
    vert: string
    // Solution Fragment Shader Code.
    frag: string
}

interface IExerciseViewState {
    frag: string
    error: string
}

export default class ExerciseView extends React.Component<IExerciseViewProps, IExerciseViewState> {
    private lastFragGot?: string
    private refGot = React.createRef<HTMLCanvasElement>()
    private refExpected = React.createRef<HTMLCanvasElement>()

    state: IExerciseViewState = {
        frag: LocalStorage.get(this.props.id, `precision mediump float;

        void main() {
            gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
        }`) as string,
        error: ""
    }

    private readonly handleChange = (frag: string) => {
        this.setState({ frag }, this.repaint)
    }

    private readonly repaint = Debouncer(
        () => {
            const canvasGot = this.refGot.current
            const canvasExpected = this.refExpected.current
            if (!canvasGot || !canvasExpected) return

            this.setState({ error: "" })
            try {
                this.paint(
                    canvasExpected,
                    this.props.frag
                )
            } catch (ex) {
                console.log("Expected")
                console.error(ex)
            }
            try {
                this.paint(
                    canvasGot,
                    this.state.frag
                )
                LocalStorage.set(this.props.id, this.state.frag)
            } catch (ex) {
                console.log("Got")
                console.error(ex)
                this.setState({ error: `${ex}`})
            }
        },
        DEBOUNCING_DELAY
    )

    componentDidMount = this.repaint
    componentDidUpdate() {
        const { frag } = this.state
        if (frag === this.lastFragGot) return

        this.lastFragGot = frag
        this.repaint()
    }

    private paint(canvas: HTMLCanvasElement, frag: string) {
        const { vert, painter } = this.props
        const scene = new TGD.Scene(canvas)
        const prg = scene.program.create({ vert, frag })
        painter(scene.gl, prg)
    }

    private readonly handleSolution = () => {
        this.setState({
            frag: this.props.frag
        })
    }

    render() {
        const { frag, error } = this.state
        const classNames = ['custom', 'view-ExerciseView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <div className={classNames.join(" ")}>
            <div className="header">
                <div>
                    <div>Your result</div>
                    <canvas
                        ref={this.refGot}
                        width="300"
                        height="300"
                        className="thm-ele-button"
                    ></canvas>
                </div>
                <div>
                    <div>Expected result</div>
                    <canvas
                        ref={this.refExpected}
                        width="300"
                        height="300"
                        className="thm-ele-button"
                    ></canvas>
                </div>
            </div>
            <label>Code of your Fragment Shader:</label>
            <CodeEditor
                lang="glsl"
                code={frag}
                onChange={this.handleChange}
            />
            {
                error &&
                <pre className="error">{
                    error
                }</pre>
            }
            <Button
                wide={true}
                icon="show"
                label="Show me the code of a possible solution"
                onClick={this.handleSolution}
            />
        </div>
    }
}
