import Scene from '../../../scene'
import Painter from '../../painter'
import Vert from './texture.vert'
import Frag from './texture.frag'
import { IWebGL } from '../../../types'
import Transfo2D from '../../../transformation/matrix-2d'
import Texture from '../../../texture/texture-common'

interface IAssets {
    prg: WebGLProgram
}

export default class TexturePainter extends Painter<IAssets> {
    public readonly transfo = new Transfo2D()
    private readonly buff: WebGLBuffer
    private prg: WebGLProgram
    private uniTransfo: WebGLUniformLocation
    private uniTexture: WebGLUniformLocation
    private attPoint = 0

    private constructor(scene: Scene, private readonly texture: Texture) {
        super(scene)
        const buff = scene.gl.createBuffer()
        if (!buff) throw "Unable to create a WebGL Buffer!"

        this.buff = buff
        const { gl } = scene
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, +1, 0, 0,
                +1, +1, 1, 0,
                -1, -1, 0, 1,
                +1, -1, 1, 1
            ]),
            gl.STATIC_DRAW
        )
        this.transfo.cover = true
    }

    get id(): string { return "TexturePainter" }
    initializeCommon(): IAssets {
        const { scene } = this
        const prg = scene.program.create({
            vert: Vert, frag: Frag
        })
        return { prg }
    }
    initialize(assets: IAssets) {
        const gl = this.scene.gl
        const { prg } = assets
        this.prg = prg
        this.uniTransfo = uniLoc(gl, prg, "uniTransfo")
        this.uniTexture = uniLoc(gl, prg, "uniTexture")
        this.attPoint = gl.getAttribLocation(prg, 'attPoint')
    }
    paint() {
        const {
            prg, scene, buff, transfo, attPoint, uniTransfo
        } = this
        const { z } = this.transfo
        const { gl } = scene
        transfo.eval(scene.width, scene.height)
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.useProgram(prg)
        gl.enableVertexAttribArray(attPoint)
        gl.vertexAttribPointer(
            attPoint,
            4, gl.BYTE, false,
            4, 0
        )
        gl.uniformMatrix3fv(uniTransfo, false, this.transfo.matrix)
        gl.uniform1f(this.uniTexture, 0)
        this.texture.activate()
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    prepareNextFrame() { }
    destroy() { }
    destroyCommon() {
        const { scene, prg } = this
        const { gl } = scene
        gl.deleteProgram(prg)
    }
}

function uniLoc(gl: IWebGL, prg: WebGLProgram, name: string): WebGLUniformLocation {
    const loc = gl.getUniformLocation(prg, name)
    if (!loc) throw `Uniform name not found: "${name}"!`

    return loc
}

