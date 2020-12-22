import * as React from "react"
import Draw from '../../../view/draw'
import ArticleView from '../../../view/article'
import Content from './intro-page.md'

import './intro-page.css'


export default class IntroView extends ArticleView {
    renderChild(
        type: string,
        attribs: { [key: string]: string },
        content: string, key: number
    ): JSX.Element | null {
        switch (type) {
            case "Coords": return renderCoords()
            case "Exercise": return renderExercise()
            case "Pipeline": return renderPipeline()
            default: return null
        }
    }
    getSourceURL() { return Content }
    getTitle() { return "WebGL Fundamentals" }

}


function renderPipeline(): JSX.Element {
    return <figure className="page-intro-Pipeline">
        <section>
            <div>Attributes</div>
            <div>Uniforms</div>
            <big />
            <big />
            <em>Vertex Shader</em><code>gl_Position</code>
            <big />
            <div>Varyings</div>
            <div>Uniforms</div>
            <big />
            <big />
            <em>Fragment Shader</em><code>gl_FragColor</code>
        </section>
    </figure>
}

function renderCoords(): JSX.Element {
    return Draw.create({ width: 280, height: 260, caption: "Coordinates System" })
        .axis()
        .blue()
        .dot(0, 0, "(0,0)")
        .dot(+1, 0, "(+1,0)", "RT")
        .dot(-1, 0, "(-1,0)", "LB")
        .dot(0, +1, "(0,+1)", "LT")
        .dot(0, -1, "(0,-1)", "RB")
        .black()
        .thickness(4)
        .orange()
        .opacity(.2)
        .fillTri(
            -.7, -.5,
            -.1, .7,
            .5, -.8
        )
        .opacity(1)
        .drawTri(
            -.7, -.5,
            -.1, .7,
            .5, -.8
        )
        .black()
        .dot(-.7, -.5, "(-0.7,-0.5)")
        .dot(-.1, .7, "(-0.1,+0.7)")
        .dot(.5, -.8, "(+0.5,-0.8)")
        .render()
}

function renderExercise(): JSX.Element {
    return Draw.create({ width: 160, height: 160, caption: "Try to reproduce this shape" })
        .axis()
        .orange()
        .drawTri(
            0, 1,
            .5, -.9,
            0, -.5
        )
        .drawTri(
            0, 1,
            -.5, -.9,
            0, -.5
        )
        .fillTri(
            0, 1,
            .5, -.9,
            0, -.5
        )
        .fillTri(
            0, 1,
            -.5, -.9,
            0, -.5
        )
        .fillTri(
            0, .8,
            -.5, .3,
            .5, .3
        )
        .render()
}

//     private refCanvas1 = React.createRef<HTMLCanvasElement>()
//     private refCanvas2 = React.createRef<HTMLCanvasElement>()
//     private refCanvas3 = React.createRef<HTMLCanvasElement>()
//     state: IIntroViewState = {}

//     componentDidMount() {
//         const canvas1 = this.refCanvas1.current
//         const canvas2 = this.refCanvas2.current
//         const canvas3 = this.refCanvas3.current
//         if (!canvas1 || !canvas2 || !canvas3) return

//         SimpleTri.paint(canvas1, false)
//         SimpleTri.paint(canvas2, true)
//         ColorTri.paint(canvas3)
//     }

//     render() {
//         const classNames = ['custom', 'page-IntroView']
//         if (typeof this.props.className === 'string') {
//             classNames.push(this.props.className)
//         }

//         return <article className={classNames.join(" ")}>
//             <header>WebGL Fundamentals</header>
//             <h1>Coordinates System</h1>
//             <div>
//                 <MD>
//                     In this lesson, we will paint an orange triangle on the screen.
//                     But to do that, we will need to learn few WebGL fundamentals.
//                 </MD>
//                 <MD>
//                     The first one is the __coordinates system__.
//                 </MD>
//                 <MD>
//                     Every pixel on the canvas can be adressed by two numbers: `(x, y)`.
//                     They are __real numbers__ lying between `-1` and `+1`, regardless of
//                     the aspect ratio of your canvas.  

//                     That means that even if your canvas is rectangular, the top left pixel's
//                     coordinates is always `(-1, +1)`.
//                 </MD>
//             </div>
//             {
//                 Draw.create()
//                     .axis()
//                     .blue()
//                     .dot(0, 0, "(0,0)")
//                     .dot(+1, 0, "(+1,0)", "RT")
//                     .dot(-1, 0, "(-1,0)", "LB")
//                     .dot(0, +1, "(0,+1)", "LT")
//                     .dot(0, -1, "(0,-1)", "RB")
//                     .black()
//                     .thickness(4)
//                     .orange()
//                     .opacity(.2)
//                     .fillTri(
//                         -.7, -.5,
//                         -.1, .7,
//                         .5, -.8
//                     )
//                     .opacity(1)
//                     .drawTri(
//                         -.7, -.5,
//                         -.1, .7,
//                         .5, -.8
//                     )
//                     .black()
//                     .dot(-.7, -.5, "(-0.7,-0.5)")
//                     .dot(-.1, .7, "(-0.1,+0.7)")
//                     .dot(.5, -.8, "(+0.5,-0.8)")
//                     .render()
//             }
//             <div>Drawing a triangle with only one attribute...</div>
//             <figure>
//                 <canvas className="preview" ref={this.refCanvas1}></canvas>
//                 <div>antialias = false</div>
//             </figure>
//             <figure>
//                 <canvas className="preview" ref={this.refCanvas2}></canvas>
//                 <div>antialias = true</div>
//             </figure>
//             <div>Drawing a triangle with two attributes...</div>
//             <figure>
//                 <canvas className="preview" ref={this.refCanvas3}></canvas>
//                 <div><code>attPoint</code> and <code>attColor</code></div>
//             </figure>
//         </article>
//     }
// }
