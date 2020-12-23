import * as React from "react"
import Draw from '../../../view/draw'
import ArticleView from '../../../view/article'
import Content from './uniforms-lesson.md'
import Scene from '../../../view/scene'
import VertShader from './uniforms.vert'
import FragShader from './uniforms.frag'


export default class UniformsView extends ArticleView {
    renderChild(
        type: string,
        attribs: { [key: string]: string },
        content: string, key: number
    ): JSX.Element | null {
        switch (type) {
            case "Exercise": return renderExercise()
            default: return null
        }
    }
    getSourceURL() { return Content }
    getTitle() { return "Uniforms" }

}


function renderExercise(): JSX.Element {
    return <figure>
        <Scene<WebGLProgram>
            onInit={scene => {
                const prg = scene.program.create({
                    vert: VertShader,
                    frag: FragShader
                })
                const data = new Float32Array([
                    0.5, 0, .5, 0,
                    0.5, 150, .5, 0,
                    0.5, 210, .5, 0,
                    0.5, 0, .5, 150,
                    0.5, 150, .5, 150,
                    0.5, 210, .5, 150,
                    0.5, 0, .5, 210,
                    0.5, 150, .5, 210,
                    0.5, 210, .5, 210,
                ])
                const { gl } = scene
                const buff = gl.createBuffer()
                if (!buff) throw "Unable to create data buffer!"
                gl.bindBuffer(gl.ARRAY_BUFFER, buff)
                gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
                gl.enableVertexAttribArray(0)
                gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 0, 0)

                return prg
            }}
            onAnim={(time, scene, prg) => {
                const { gl } = scene
                gl.clearColor(0, 0.4, 0.867, 1.0)
                gl.clear(gl.COLOR_BUFFER_BIT)
                const uniTime = gl.getUniformLocation(prg, "uniTime")
                gl.uniform1f(uniTime, time)
                gl.drawArrays(gl.TRIANGLES, 0, 9)
            }}
        />
        <div>Dancing triangles</div>
    </figure>
}