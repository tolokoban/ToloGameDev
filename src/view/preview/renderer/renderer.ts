import Resizer from "./resizer"
import { attachAttributes } from "./attach-attributes"
import { createAndFillArrayBuffer } from "./create-and-fill-array-buffer"
import { createAndFillElementArrayBuffer } from "./create-and-fill-element-array-buffer"
import { createProgram } from "@/tools/webgl/create-program"
import { createVertexArray } from "@/tools/webgl/create-vertex-array"
import { createWebGL2Context } from "./create-webgl2-context"
import { getDrawMode } from "./get-draw-mode"
import { TGDPainter } from "@/types"
import { divideAttributes } from "./divide-attributes"
import { getConstName } from "../../../tools/webgl/get-const-name"

let globalId = 1

export default class Renderer {
    public readonly ID = globalId++
    private readonly gl: WebGL2RenderingContext
    private readonly prg: WebGLProgram
    private readonly arrayBuffers: WebGLBuffer[] = []
    private readonly elementArrayBuffer: WebGLBuffer
    private readonly vertexArray: WebGLVertexArrayObject
    private readonly uniTime: WebGLUniformLocation | null
    private readonly uniInverseAspectRatio: WebGLUniformLocation | null
    private readonly uniAspectRatio: WebGLUniformLocation | null
    private readonly uniAspectRatioContain: WebGLUniformLocation | null
    private readonly uniAspectRatioCover: WebGLUniformLocation | null
    /**
     * Drawing mode: gl.POINTS, gl.LINES, gl.TRIANGLE_FAN, ...
     */
    private readonly mode: number
    private readonly resizer = new Resizer()
    private playing = true

    constructor(
        private canvas: HTMLCanvasElement,
        private painter: TGDPainter
    ) {
        const gl = createWebGL2Context(canvas)
        this.gl = gl
        this.mode = getDrawMode(gl, painter.mode)
        this.prg = createProgram(gl, {
            vert: painter.vertexShader,
            frag: painter.fragmentShader,
        })
        this.vertexArray = createVertexArray(gl)
        gl.bindVertexArray(this.vertexArray)
        this.elementArrayBuffer = createAndFillElementArrayBuffer(gl, painter)
        const groups = divideAttributes(painter.attributes)
        for (const grp of groups) {
            this.arrayBuffers.push(
                createAndFillArrayBuffer(
                    gl,
                    grp.attributes,
                    painter.preview.data.attributes
                )
            )
            attachAttributes(gl, this.prg, grp.attributes)
        }
        gl.bindVertexArray(null)
        this.uniTime = gl.getUniformLocation(this.prg, "uniTime")
        this.uniInverseAspectRatio = gl.getUniformLocation(
            this.prg,
            "uniInverseAspectRatio"
        )
        this.uniAspectRatio = gl.getUniformLocation(this.prg, "uniAspectRatio")
        this.uniAspectRatioCover = gl.getUniformLocation(
            this.prg,
            "uniAspectRatioCover"
        )
        this.uniAspectRatioContain = gl.getUniformLocation(
            this.prg,
            "uniAspectRatioContain"
        )
        window.requestAnimationFrame(this.paint)
    }

    destroy() {
        console.log("destroy ", this.ID)
        const { gl, prg } = this
        gl.deleteBuffer(this.elementArrayBuffer)
        for (const arrayBuffer of this.arrayBuffers) {
            gl.deleteBuffer(arrayBuffer)
        }
        gl.deleteProgram(prg)
        gl.deleteVertexArray(this.vertexArray)
        this.playing = false
    }

    private readonly paint = (time: number) => {
        if (this.playing) {
            window.requestAnimationFrame(this.paint)
        }
        const { canvas, painter, resizer, gl, prg, vertexArray } = this

        resizer.check(gl, canvas)
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT)
        if (this.uniTime) gl.uniform1f(this.uniTime, time)
        if (this.uniAspectRatio)
            gl.uniform1f(this.uniAspectRatio, resizer.ratio)
        if (this.uniInverseAspectRatio)
            gl.uniform1f(this.uniInverseAspectRatio, resizer.inverseRatio)
        if (this.uniAspectRatioContain)
            gl.uniform2fv(this.uniAspectRatioContain, resizer.contain)
        if (this.uniAspectRatioCover)
            gl.uniform2fv(this.uniAspectRatioCover, resizer.cover)
        gl.bindVertexArray(vertexArray)
        const { elementCount, instanceCount, vertexCount } =
            painter.preview.data
        if (instanceCount > 0) {
            if (elementCount > 0) {
                console.log(
                    `gl.drawElementsInstanced(gl.${getConstName(
                        gl,
                        this.mode
                    )}, ${elementCount}, gl.UNSIGNED_SHORT, 0, ${instanceCount})`
                )
                gl.drawElementsInstanced(
                    this.mode,
                    elementCount,
                    gl.UNSIGNED_SHORT,
                    0,
                    instanceCount
                )
            } else {
                gl.drawArraysInstanced(this.mode, 0, vertexCount, instanceCount)
            }
        } else {
            if (elementCount > 0) {
                gl.drawElements(this.mode, elementCount, gl.UNSIGNED_SHORT, 0)
            } else {
                gl.drawArrays(this.mode, 0, vertexCount)
            }
        }
        gl.bindVertexArray(null)
    }
}
