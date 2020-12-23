// tslint:disable: no-magic-numbers
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
            case "Polar": return renderPolar()
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

function renderPolar(): JSX.Element {
    return Draw.create({ width: 280, height: 260, caption: "Polar Coordinates System" })
        .axis()
        .orange()
        .opacity(.5)
        .fillTri(
            1, 0,
            -.5, 0.8660254037844386,
            -.5, -0.8660254037844386
        )
        .opacity(1)
        .black()
        .drawArc(0, 0, 1)
        .thickness(.5)
        .drawArc(0, 0, .33333, 0, 120)
        .drawArc(0, 0, .66666, 0, 240)
        .thickness(1)
        .blue()
        .thickness(2)
        .line(0, 0, 1, 0)
        .line(0, 0, -.5, 0.8660254037844386)
        .line(0, 0, -.5, -0.8660254037844386)
        .black()
        .dot(1, 0, "(1,0°)", "T")
        .dot(-.5, 0.8660254037844386, "(1,120°)")
        .dot(-.5, -0.8660254037844386, "(1,240°)")
        .render()
}

