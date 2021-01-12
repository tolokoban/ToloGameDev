import Painter from '../painter'
import Vert from './shape.vert'
import Frag from './shape.frag'
import { IWebGL } from '../../types'

interface IAssets {
    prg: WebGLProgram
}

export default class ShapePainter extends Painter<IAssets> {
    public readonly color = new Float32Array([1, 0.5, 0, 1])
    public x = 0
    public y = 0
    public z = 0.5
    public scale = 1
    public rotation = 0
    public cover = false
    private buff: WebGLBuffer
    private prg: WebGLProgram
    private verticesCount = 0
    private uniX: WebGLUniformLocation
    private uniY: WebGLUniformLocation
    private uniZ: WebGLUniformLocation
    private uniColor: WebGLUniformLocation
    private uniScale: WebGLUniformLocation
    private uniScaleX: WebGLUniformLocation
    private uniScaleY: WebGLUniformLocation

    get id(): string { return "ShapePainter" }
    initializeCommon(): IAssets {
        const { scene } = this
        const prg = scene.program.create({
            vert: Vert, frag: Frag
        })
        return { prg }
    }
    initialize(assets: IAssets) {
        const gl = this.scene.gl
        const buff = gl.createBuffer()
        if (!buff) throw "Unable to create a WebGL Buffer!"

        const { prg } = assets
        this.buff = buff
        this.prg = prg
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.useProgram(prg)
        gl.enableVertexAttribArray(
            gl.getAttribLocation(prg, 'attPoint'))
        gl.vertexAttribPointer(
            gl.getAttribLocation(prg, 'attPoint'),
            2, gl.FLOAT, false,
            8, 0
        )
        this.uniX = uniLoc(gl, prg, "uniX")
        this.uniY = uniLoc(gl, prg, "uniY")
        this.uniZ = uniLoc(gl, prg, "uniZ")
        this.uniColor = uniLoc(gl, prg, "uniColor")
        this.uniScale = uniLoc(gl, prg, "uniScale")
        console.log("initialized!")
    }
    paint() {
        const {
            prg, scene, buff, verticesCount,
            x, y, z, color, scale,
            uniX, uniY, uniZ, uniColor, uniScale
        } = this
        const { gl } = scene
        gl.useProgram(prg)
        gl.uniform1f(uniX, x)
        gl.uniform1f(uniY, y)
        gl.uniform1f(uniZ, z)
        gl.uniform4fv(uniColor, color)
        gl.uniform1f(uniScale, scale)
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, verticesCount)
    }
    prepareNextFrame() { }
    destroy() { }
    destroyCommon() { }

    makeDisk(radius = 1, steps = 32) {
        const data = new Float32Array(2 + steps << 1)
        data[0] = 0
        data[1] = 0
        const angStep = Math.PI * 2 / steps
        let ptr = 2
        for (let i = 0; i < steps; i++) {
            const ang = angStep * i
            data[ptr++] = radius * Math.cos(ang)
            data[ptr++] = radius * Math.sin(ang)
        }
        data[ptr++] = radius
        data[ptr++] = 0
        this.points = data
    }

    set points(data: Float32Array) {
        const { buff, scene } = this
        const { gl } = scene
        console.log("[shape-painter] data = ", data) // @FIXME: Remove this line written on 2021-01-12 at 22:34
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
        this.verticesCount = data.length >> 1
        console.log("[shape-painter] this.verticesCount = ", this.verticesCount) // @FIXME: Remove this line written on 2021-01-12 at 22:39
    }
}

function uniLoc(gl: IWebGL, prg: WebGLProgram, name: string): WebGLUniformLocation {
    const loc = gl.getUniformLocation(prg, name)
    if (!loc) throw `Uniform name not found: "${name}"!`

    return loc
}



class Data {
    private readonly data: ArrayBuffer
    private readonly buff: WebGLBuffer
    public cursor = 0

    constructor(
        private readonly gl: WebGL2RenderingContext | WebGLRenderingContext,
        private readonly attribsCount: number
    ) {
        this.data = new ArrayBuffer(attribsCount * 4)
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
            2, gl.BYTE, false,
            4, 0
        )
    }

    set(
        attPoint1: number, attPoint2: number
    ) {
        const { cursor, attribsCount } = this
        if (cursor < 0) throw "Cursor cannot be negative!"
        if (cursor >= attribsCount)
            throw `Cursor must be lesser than ${attribsCount}!`
        const view = new DataView(this.data, cursor * 4, 4)
        view.setInt8(0, attPoint1)
        view.setInt8(1, attPoint2)
        this.cursor++
    }

    send() {
        const { gl, buff, data } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    }
}
