import Scene from '../../scene'
import Painter from '../painter'
import Vert from './shape.vert'
import Frag from './shape.frag'
import { IWebGL } from '../../types'
import Transfo2D from '../../transformation/matrix-2d'

interface IAssets {
    prg: WebGLProgram
}

const RED = 0
const GREEN = 1
const BLUE = 2
const ALPHA = 3

export default class ShapePainter extends Painter<IAssets> {
    public readonly color = new Float32Array([1, 0.5, 0, 1])
    public readonly transfo = new Transfo2D()
    private readonly buff: WebGLBuffer
    private prg: WebGLProgram
    private readonly verticesCount: number
    private uniZ: WebGLUniformLocation
    private uniColor: WebGLUniformLocation
    private uniTransfo: WebGLUniformLocation

    private constructor(scene: Scene, data: Float32Array) {
        super(scene)
        const buff = scene.gl.createBuffer()
        if (!buff) throw "Unable to create a WebGL Buffer!"

        this.buff = buff
        const { gl } = scene
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
        this.verticesCount = data.length >> 1
    }

    get red() { return this.color[RED] }
    set red(v: number) { this.color[RED] = v }
    get blue() { return this.color[BLUE] }
    set blue(v: number) { this.color[BLUE] = v }
    get green() { return this.color[GREEN] }
    set green(v: number) { this.color[GREEN] = v }
    get alpha() { return this.color[ALPHA] }
    set alpha(v: number) { this.color[ALPHA] = v }

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
        const { prg } = assets
        this.prg = prg
        gl.useProgram(prg)
        this.uniTransfo = uniLoc(gl, prg, "uniTransfo")
        this.uniZ = uniLoc(gl, prg, "uniZ")
        this.uniColor = uniLoc(gl, prg, "uniColor")
        console.log("initialized!")
    }
    paint() {
        const {
            prg, scene, buff, verticesCount, color, transfo,
            uniZ, uniColor, uniTransfo
        } = this
        const { z } = this.transfo
        const { gl } = scene
        transfo.eval(scene.width, scene.height)
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.useProgram(prg)
        gl.enableVertexAttribArray(
            gl.getAttribLocation(prg, 'attPoint'))
        gl.vertexAttribPointer(
            gl.getAttribLocation(prg, 'attPoint'),
            2, gl.FLOAT, false,
            8, 0
        )
        gl.uniform1f(uniZ, z)
        gl.uniform4fv(uniColor, color)
        gl.uniformMatrix3fv(uniTransfo, false, this.transfo.matrix)
        gl.drawArrays(gl.TRIANGLE_FAN, 0, verticesCount)
    }
    prepareNextFrame() { }
    destroy() { }
    destroyCommon() { }

    /**
     * Create a shape from a list of pairs of numbers (x,y).
     * The result will be a fan, so the first two values are often (0,0).
     */
    static Any(scene: Scene, data: Float32Array) {
        return new ShapePainter(scene, data)
    }

    static Disk(scene: Scene, radius = 1, steps = 32) {
        const data = new Float32Array(2 + steps << 1)
        data[0] = 0
        data[1] = 0
        const angStep = Math.PI * 2 / steps
        let ptr = 2
        for (let i = 0; i < steps; i++) {
            const ang = angStep * i
            data[ptr++] = radius * Math.sin(ang)
            data[ptr++] = radius * Math.cos(ang)
        }
        data[ptr++] = 0
        data[ptr++] = radius

        return new ShapePainter(scene, data)
    }

    static Arrow(scene: Scene, radius: number = 1, angle = 1, depth = 0.66667) {
        const x = radius * depth * Math.sin(Math.PI - angle)
        const y = radius * depth * Math.cos(Math.PI - angle)
        const data = new Float32Array([
            0, 0,
            x, y,
            0, radius,
            -x, y
        ])

        return new ShapePainter(scene, data)
    }
}

function uniLoc(gl: IWebGL, prg: WebGLProgram, name: string): WebGLUniformLocation {
    const loc = gl.getUniformLocation(prg, name)
    if (!loc) throw `Uniform name not found: "${name}"!`

    return loc
}

