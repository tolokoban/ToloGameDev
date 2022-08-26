import PointerWatcher from "../../../watcher/pointer/pointer-watcher"
import Resizer from "./resizer"
import { attachAttributes } from "./attach-attributes"
import { createAndFillArrayBuffer } from "./create-and-fill-array-buffer"
import { createAndFillElementArrayBuffer } from "./create-and-fill-element-array-buffer"
import { createProgram } from "@/tools/webgl/create-program"
import { createVertexArray } from "@/tools/webgl/create-vertex-array"
import { createWebGL2Context } from "./create-webgl2-context"
import { divideAttributes } from "./divide-attributes"
import { getConstName } from "@/tools/webgl/get-const-name"
import { getDrawMode } from "./get-draw-mode"
import { TGDPainter } from "@/types"

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
    private readonly uniVertexCount: WebGLUniformLocation | null
    private readonly uniElementCount: WebGLUniformLocation | null
    private readonly uniInstanceCount: WebGLUniformLocation | null
    private readonly uniPointer: WebGLUniformLocation | null
    /**
     * Drawing mode: gl.POINTS, gl.LINES, gl.TRIANGLE_FAN, ...
     */
    private readonly mode: number
    private readonly resizer = new Resizer()
    private readonly pointer = new PointerWatcher()
    private playing = true

    constructor(
        private canvas: HTMLCanvasElement,
        private painter: TGDPainter
    ) {
        this.pointer.attach(canvas)
        const gl = createWebGL2Context(canvas, {
            depth: painter.depth.enabled,
        })
        this.gl = gl
        this.mode = getDrawMode(gl, painter.mode)
        this.prg = createProgram(gl, {
            vert: painter.shader.vert,
            frag: painter.shader.frag,
        })
        this.vertexArray = createVertexArray(gl)
        gl.bindVertexArray(this.vertexArray)
        this.elementArrayBuffer = createAndFillElementArrayBuffer(gl, painter)
        const groups = divideAttributes(painter.attributes)
        for (const grp of groups) {
            this.arrayBuffers.push(createAndFillArrayBuffer(gl, grp.attributes))
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
        this.uniVertexCount = gl.getUniformLocation(this.prg, "uniVertexCount")
        this.uniElementCount = gl.getUniformLocation(
            this.prg,
            "uniElementCount"
        )
        this.uniInstanceCount = gl.getUniformLocation(
            this.prg,
            "uniInstanceCount"
        )
        this.uniPointer = gl.getUniformLocation(this.prg, "uniPointer")
        if (painter.depth.enabled) {
            gl.enable(gl.DEPTH_TEST)
            gl.clearDepth(painter.depth.clear)
            gl.depthFunc(painter.depth.func)
            gl.depthMask(painter.depth.mask)
            gl.depthRange(painter.depth.range.near, painter.depth.range.far)
        } else {
            gl.disable(gl.DEPTH_TEST)
        }
        window.requestAnimationFrame(this.paint)
    }

    destroy() {
        console.log("destroy ", this.ID)
        const { gl, prg } = this
        this.pointer.detach()
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

        resizer.check(gl)
        gl.clearColor(0, 0, 0, 1)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        this.setUniformValues(time)
        gl.bindVertexArray(vertexArray)
        if (painter.count.instance > 0) {
            if (painter.count.element > 0) {
                gl.drawElementsInstanced(
                    this.mode,
                    painter.count.element,
                    gl.UNSIGNED_SHORT,
                    0,
                    painter.count.instance
                )
            } else {
                gl.drawArraysInstanced(
                    this.mode,
                    0,
                    painter.count.vertex,
                    painter.count.instance
                )
            }
        } else {
            if (painter.count.element > 0) {
                gl.drawElements(
                    this.mode,
                    painter.count.element,
                    gl.UNSIGNED_SHORT,
                    0
                )
            } else {
                gl.drawArrays(this.mode, 0, painter.count.vertex)
            }
        }
        gl.bindVertexArray(null)
    }

    private setUniformValues(time: number) {
        const { gl, resizer, painter } = this
        if (this.uniTime) gl.uniform1f(this.uniTime, time)
        if (this.uniAspectRatio)
            gl.uniform1f(this.uniAspectRatio, resizer.ratio)
        if (this.uniInverseAspectRatio)
            gl.uniform1f(this.uniInverseAspectRatio, resizer.inverseRatio)
        if (this.uniAspectRatioContain)
            gl.uniform2fv(this.uniAspectRatioContain, resizer.contain)
        if (this.uniAspectRatioCover)
            gl.uniform2fv(this.uniAspectRatioCover, resizer.cover)
        if (this.uniVertexCount)
            gl.uniform1f(this.uniVertexCount, painter.count.vertex)
        if (this.uniElementCount)
            gl.uniform1f(this.uniElementCount, painter.count.element)
        if (this.uniInstanceCount)
            gl.uniform1f(this.uniInstanceCount, painter.count.instance)
        if (this.uniPointer) gl.uniform4fv(this.uniPointer, this.pointer.value)
    }
}
