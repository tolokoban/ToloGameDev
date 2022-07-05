import * as React from "react"
import Draw from '../../../view/draw'
import ArticleView from '../../../view/article'
import Content from './varyings-lesson.md'
import Scene from '../../../view/scene'
import ExFrag from '../../../view/exercise-frag'
// import VertShader from './uniforms.vert'
// import FragShader from './uniforms.frag'


export default class UniformsView extends ArticleView {
    renderChild(
        type: string,
        attribs: { [key: string]: string },
        content: string, key: number
    ): JSX.Element | null {
        switch (type) {
            case "TriColor": return renderTriColor()
            case "Barycenter": return renderBarycenter()
            case "Coords": return renderCoodrs()
            case "Ex": return renderEx()
            default: return null
        }
    }
    getSourceURL() { return Content }
    getTitle() { return "Varyings" }

}


function renderCoodrs() {
    return Draw.create({ width: 360, height: 300 })
        .axis()
        .orange()
        .opacity(.3)
        .fillTri(
            0, .9,
            .6, -.7,
            -.7, -.6
        )
        .opacity(1)
        .black()
        .drawTri(
            0, .9,
            .6, -.7,
            -.7, -.6
        )
        .dot(0, .9, "(0,900)")
        .text(0, .9, "(255,128,0)", "TL")
        .dot(.6, -.7, "(600,-700)", "BL")
        .text(.6, -.7, "(0,102,221)", "TL")
        .dot(-.7, -.6, "(600,-700)", "BR")
        .text(-.7, -.6, "(255,255,255)", "TR")
        .render()
}

function renderTriColor(): JSX.Element {
    return <figure>
        <Scene<WebGLProgram>
            onInit={scene => {
                const { gl } = scene
                const prg = scene.program.create({
                    vert: `attribute vec2 attPoint;
attribute vec3 attColor;
// Declare a varying.
varying vec3 varColor;
void main() {
    // Set its value.
    varColor = attColor;
    gl_Position = vec4(attPoint, 0.0, 1000.0);
}`,
                    frag: `precision mediump float;
// Declare a varying.
varying vec3 varColor;
void main() {
    gl_FragColor = vec4(varColor, 1.0);
}`
                })
                const data = new Data(gl, 3)
                data.set(0, 900, 255, 128, 0)
                data.set(600, -700, 0, 102, 221)
                data.set(-700, -600, 255, 255, 255)
                data.init(prg)
                data.send()
                gl.clearColor(0, 0.4, 0.867, 1.0)
                gl.clear(gl.COLOR_BUFFER_BIT)
                gl.drawArrays(gl.TRIANGLES, 0, 3)

                return prg
            }}
        />
        <div>Colors interpolation</div>
    </figure>
}

function renderBarycenter(): JSX.Element {
    return <figure>
        <Scene<WebGLProgram>
            onInit={scene => {
                const { gl } = scene
                const prg = scene.program.create({
                    vert: `attribute vec2 attPoint;
attribute vec3 attColor;
attribute vec3 attBarycenter;
varying vec3 varColor;
varying vec3 varBarycenter;
void main() {
    varColor = attColor;
    varBarycenter = attBarycenter;
    gl_Position = vec4(attPoint, 0.0, 1000.0);
}`,
                    frag: `precision mediump float;
uniform float uniTime;
varying vec3 varBarycenter;
varying vec3 varColor;
void main() {
    float dist = max(
        varBarycenter.x,
        max(
            varBarycenter.y,
            varBarycenter.z
        ));
    vec3 oppColor = vec3(1.0, 1.0, 1.0) - varColor;
    float alpha = (cos(dist * 66.6 - uniTime * 0.01) + 1.0) * 0.5;
    gl_FragColor = vec4(
        mix(varColor, oppColor, alpha),
        1.0
    );
}`
                })
                const data = new Data2(gl, 3)
                data.set(0, 900, 255, 128, 0, 255, 0, 0)
                data.set(600, -700, 0, 255, 128, 0, 255, 0)
                data.set(-700, -600, 128, 0, 255, 0, 0, 255)
                data.init(prg)
                data.send()

                return prg
            }}
            onAnim={(time, scene, prg) => {
                const { gl } = scene
                gl.clearColor(0, 0.4, 0.867, 1.0)
                gl.clear(gl.COLOR_BUFFER_BIT)
                const uniTime = gl.getUniformLocation(prg, "uniTime")
                gl.uniform1f(uniTime, time)
                gl.drawArrays(gl.TRIANGLES, 0, 3)
                return prg
            }}
        />
        <div>Ribbed Triangle</div>
    </figure>
}

function renderEx(): JSX.Element {
    const exercises = {
        Borders: `precision mediump float;
varying vec3 varColor;
varying vec3 varBarycenter;
void main() {
    vec3 oppColor = vec3(1.0, 1.0, 1.0) - varColor;
    float dist = min(varBarycenter.x, min(varBarycenter.y, varBarycenter.z));
    if (dist < 0.1) {
        gl_FragColor = vec4(oppColor, 1.0);
    } else {
        gl_FragColor = vec4(varColor, 1.0);
    }
}`,
        Hexagon: `precision mediump float;
varying vec3 varColor;
varying vec3 varBarycenter;
void main() {
    vec3 oppColor = vec3(1.0, 1.0, 1.0) - varColor;
    float distMax = max(
        varBarycenter.x,
        max(
            varBarycenter.y,
            varBarycenter.z
        ));
    float distMin = min(
        varBarycenter.x,
        min(
            varBarycenter.y,
            varBarycenter.z
        ));
    float dist = distMax - distMin;
    if (dist > 0.5) {
        gl_FragColor = vec4(oppColor, 1.0);
    } else {
        gl_FragColor = vec4(varColor, 1.0);
    }
}`,
        Stipes: `precision mediump float;
varying vec3 varColor;
varying vec3 varBarycenter;
void main() {
  vec3 oppColor = vec3(1.0, 1.0, 1.0) - varColor;
  float dist = min(varBarycenter.x, min(varBarycenter.y, varBarycenter.z));
  float alpha = cos(dist * 40.0);
  if (alpha > 0.0) {
    gl_FragColor = vec4(mix(oppColor, varColor, alpha), 1.0);
  } else {
    discard;
  }
}`,
        Blocks: `precision mediump float;
varying vec3 varColor;
varying vec3 varBarycenter;
void main() {
  float x = gl_FragCoord.x * 0.05;
  x = fract(x);
  x = min(x, 1.0 - x) + 0.5;
  float y = gl_FragCoord.y * 0.05;
  y = fract(y);
  y = min(y, 1.0 - y) + 0.5;
  vec3 oppColor = vec3(1.0, 1.0, 1.0) - varColor;
  float dist = min(varBarycenter.x, min(varBarycenter.y, varBarycenter.z));
  float alpha = cos(dist * 40.0);
  gl_FragColor = vec4(mix(oppColor, varColor, alpha) * x * y, 1.0);
}`
    }
    return <div>
        {
            Object.keys(exercises).map(
                id => {
                    const frag = exercises[id] as string
                    if (!frag) return null

                    return <div key={id}>
                        <h2>{id}</h2>
                        <ExFrag
                            id={id}
                            frag={frag}
                            vert={`attribute vec2 attPoint;
                    attribute vec3 attColor;
                    attribute vec3 attBarycenter;
                    varying vec3 varColor;
                    varying vec3 varBarycenter;
                    void main() {
                        varColor = attColor;
                        varBarycenter = attBarycenter;
                        gl_Position = vec4(attPoint, 0.0, 1000.0);
                    }`}
                            painter={(gl, prg) => {
                                const data = new Data2(gl, 3)
                                data.set(0, 900, 255, 128, 0, 255, 0, 0)
                                data.set(900, -800, 0, 255, 128, 0, 255, 0)
                                data.set(-900, -600, 128, 0, 255, 0, 0, 255)
                                data.init(prg)
                                data.send()

                                gl.clearColor(0, 0.4, 0.867, 1.0)
                                gl.clear(gl.COLOR_BUFFER_BIT)
                                gl.drawArrays(gl.TRIANGLES, 0, 3)
                            }}
                        />
                    </div>
                }
            )
        }
    </div>
}

class Data {
    private readonly data: ArrayBuffer
    private readonly buff: WebGLBuffer
    public cursor = 0

    constructor(
        private readonly gl: WebGL2RenderingContext | WebGLRenderingContext,
        private readonly attribsCount: number
    ) {
        this.data = new ArrayBuffer(attribsCount * 8)
        const buff = gl.createBuffer()
        if (!buff) throw "Unable to create a WebGL Buffer!"

        this.buff = buff
    }

    init(prg: WebGLProgram) {
        const { gl, buff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.useProgram(prg)
        gl.enableVertexAttribArray(
            gl.getAttribLocation(prg, 'attPoint'))
        gl.vertexAttribPointer(
            gl.getAttribLocation(prg, 'attPoint'),
            2, gl.SHORT, false,
            8, 0
        )
        gl.enableVertexAttribArray(
            gl.getAttribLocation(prg, 'attColor'))
        gl.vertexAttribPointer(
            gl.getAttribLocation(prg, 'attColor'),
            3, gl.UNSIGNED_BYTE, true,
            8, 4
        )
    }

    set(
        attPoint1: number, attPoint2: number,
        attColor1: number, attColor2: number, attColor3: number
    ) {
        const { cursor, attribsCount } = this
        if (cursor < 0) throw "Cursor cannot be negative!"
        if (cursor >= attribsCount)
            throw `Cursor must be lesser than ${attribsCount}!`
        const view = new DataView(this.data, cursor * 8, 8)
        view.setInt16(0, attPoint1, true)
        view.setInt16(2, attPoint2, true)
        view.setUint8(4, attColor1)
        view.setUint8(5, attColor2)
        view.setUint8(6, attColor3)
        this.cursor++
    }

    send() {
        const { gl, buff, data } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    }
}

class Data2 {
    private readonly data: ArrayBuffer
    private readonly buff: WebGLBuffer
    public cursor = 0

    constructor(
        private readonly gl: WebGL2RenderingContext | WebGLRenderingContext,
        private readonly attribsCount: number
    ) {
        this.data = new ArrayBuffer(attribsCount * 12)
        const buff = gl.createBuffer()
        if (!buff) throw "Unable to create a WebGL Buffer!"

        this.buff = buff
    }

    init(prg: WebGLProgram) {
        const { gl, buff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.useProgram(prg)
        gl.enableVertexAttribArray(
            gl.getAttribLocation(prg, 'attPoint'))
        gl.vertexAttribPointer(
            gl.getAttribLocation(prg, 'attPoint'),
            2, gl.SHORT, false,
            12, 0
        )
        gl.enableVertexAttribArray(
            gl.getAttribLocation(prg, 'attColor'))
        gl.vertexAttribPointer(
            gl.getAttribLocation(prg, 'attColor'),
            3, gl.UNSIGNED_BYTE, true,
            12, 4
        )
        gl.enableVertexAttribArray(
            gl.getAttribLocation(prg, 'attBarycenter'))
        gl.vertexAttribPointer(
            gl.getAttribLocation(prg, 'attBarycenter'),
            3, gl.UNSIGNED_BYTE, true,
            12, 8
        )
    }

    set(
        attPoint1: number, attPoint2: number,
        attColor1: number, attColor2: number, attColor3: number,
        attBarycenter1: number, attBarycenter2: number, attBarycenter3: number
    ) {
        const { cursor, attribsCount } = this
        if (cursor < 0) throw "Cursor cannot be negative!"
        if (cursor >= attribsCount)
            throw `Cursor must be lesser than ${attribsCount}!`
        const view = new DataView(this.data, cursor * 12, 12)
        view.setInt16(0, attPoint1, true)
        view.setInt16(2, attPoint2, true)
        view.setUint8(4, attColor1)
        view.setUint8(5, attColor2)
        view.setUint8(6, attColor3)
        view.setUint8(8, attBarycenter1)
        view.setUint8(9, attBarycenter2)
        view.setUint8(10, attBarycenter3)
        this.cursor++
    }

    send() {
        const { gl, buff, data } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    }
}
