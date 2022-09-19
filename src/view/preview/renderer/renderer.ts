import PointerWatcher from "../../../watcher/pointer/pointer-watcher"
import Resizer from "./resizer"
import Texture from "./texture"
import { attachAttributes } from "./attach-attributes"
import { AttributeDataEditorViewProps } from "./../../../../dist/view/page/painter/attribute-data-editor/attribute-data-editor-view.d"
import { createAndFillArrayBuffer } from "./create-and-fill-array-buffer"
import { createAndFillElementArrayBuffer } from "./create-and-fill-element-array-buffer"
import { createProgram } from "@/tools/webgl/create-program"
import { createVertexArray } from "@/tools/webgl/create-vertex-array"
import { createWebGL2Context } from "./create-webgl2-context"
import { divideAttributes } from "./divide-attributes"
import { getDrawMode } from "./get-draw-mode"
import {
    TGDPainter,
    TGDPainterAttribute,
    TGDPainterBlendingEqua,
    TGDPainterBlendingFunc,
} from "@/types"

let globalId = 1

interface AttributeWithLocation extends TGDPainterAttribute {
    location: number
}

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
    private readonly textures: Texture[] = []
    /**
     * Drawing mode: gl.POINTS, gl.LINES, gl.TRIANGLE_FAN, ...
     */
    private readonly mode: number
    private readonly resizer = new Resizer()
    private readonly pointer = new PointerWatcher()
    private readonly staticAttributes: AttributeWithLocation[] = []
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
            if (grp.divisor < 0) {
                // This is a static attribute used in loops.
                for (const att of grp.attributes) {
                    const location = gl.getAttribLocation(this.prg, att.name)
                    gl.disableVertexAttribArray(location)
                    this.staticAttributes.push({ ...att, location })
                }
            } else {
                this.arrayBuffers.push(
                    createAndFillArrayBuffer(gl, grp.attributes)
                )
                attachAttributes(gl, this.prg, grp.attributes)
            }
        }
        gl.bindVertexArray(null)
        for (const uni of painter.uniforms) {
            const loc = gl.getUniformLocation(this.prg, uni.name)
            if (!loc) continue

            this.textures.push(new Texture(gl, loc))
        }

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
        if (painter.blending.enabled) {
            gl.enable(gl.BLEND)
            gl.blendEquationSeparate(
                getBlendEquation(gl, painter.blending.equaRGB),
                getBlendEquation(gl, painter.blending.equaAlpha)
            )
            gl.blendFuncSeparate(
                superTogetBlendFunction(gl, painter.blending.funcSrcRGB),
                superTogetBlendFunction(gl, painter.blending.funcDstRGB),
                superTogetBlendFunction(gl, painter.blending.funcSrcAlpha),
                superTogetBlendFunction(gl, painter.blending.funcDstAlpha)
            )
        } else {
            gl.disable(gl.BLEND)
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
        for (let loop = 0; loop < painter.count.loop; loop++) {
            setStaticVertexValues(gl, loop, this.staticAttributes)
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

function setStaticVertexValues(
    gl: WebGL2RenderingContext,
    loop: number,
    staticAttributes: AttributeWithLocation[]
) {
    for (const att of staticAttributes) {
        const idx = Math.floor(loop / Math.abs(att.divisor))
        switch (att.dim) {
            case 1:
                gl.vertexAttrib1f(att.location, att.data[idx % att.data.length])
                break
            case 2:
                gl.vertexAttrib2f(
                    att.location,
                    att.data[(idx * 2) % att.data.length],
                    att.data[(idx * 2 + 1) % att.data.length]
                )
                break
            case 3:
                gl.vertexAttrib3f(
                    att.location,
                    att.data[(idx * 3) % att.data.length],
                    att.data[(idx * 3 + 1) % att.data.length],
                    att.data[(idx * 3 + 2) % att.data.length]
                )
                break
            case 4:
                gl.vertexAttrib4f(
                    att.location,
                    att.data[(idx * 4) % att.data.length],
                    att.data[(idx * 4 + 1) % att.data.length],
                    att.data[(idx * 4 + 2) % att.data.length],
                    att.data[(idx * 4 + 3) % att.data.length]
                )
                break
        }
    }
}

function getBlendEquation(
    gl: WebGL2RenderingContext,
    equa: TGDPainterBlendingEqua
): number {
    switch (equa) {
        case TGDPainterBlendingEqua.ADD:
            return gl.FUNC_ADD
        case TGDPainterBlendingEqua.SUBTRACT:
            return gl.FUNC_SUBTRACT
        case TGDPainterBlendingEqua.REVERSE_SUBTRACT:
            return gl.FUNC_REVERSE_SUBTRACT
        case TGDPainterBlendingEqua.MIN:
            return gl.MIN
        case TGDPainterBlendingEqua.MAX:
            return gl.MAX
    }
    throw Error(`Unknown equation: ${TGDPainterBlendingEqua[equa]}!`)
}

function superTogetBlendFunction(
    gl: WebGL2RenderingContext,
    func: TGDPainterBlendingFunc
): number {
    switch (func) {
        case TGDPainterBlendingFunc.ZERO:
            return gl.ZERO
        case TGDPainterBlendingFunc.ONE:
            return gl.ONE
        case TGDPainterBlendingFunc.SRC_COLOR:
            return gl.SRC_COLOR
        case TGDPainterBlendingFunc.ONE_MINUS_SRC_COLOR:
            return gl.ONE_MINUS_SRC_COLOR
        case TGDPainterBlendingFunc.DST_COLOR:
            return gl.DST_COLOR
        case TGDPainterBlendingFunc.ONE_MINUS_DST_COLOR:
            return gl.ONE_MINUS_DST_COLOR
        case TGDPainterBlendingFunc.SRC_ALPHA:
            return gl.SRC_ALPHA
        case TGDPainterBlendingFunc.ONE_MINUS_SRC_ALPHA:
            return gl.ONE_MINUS_SRC_ALPHA
        case TGDPainterBlendingFunc.DST_ALPHA:
            return gl.DST_ALPHA
        case TGDPainterBlendingFunc.ONE_MINUS_DST_ALPHA:
            return gl.ONE_MINUS_DST_ALPHA
        case TGDPainterBlendingFunc.CONSTANT_COLOR:
            return gl.CONSTANT_COLOR
        case TGDPainterBlendingFunc.ONE_MINUS_CONSTANT_COLOR:
            return gl.ONE_MINUS_CONSTANT_COLOR
        case TGDPainterBlendingFunc.CONSTANT_ALPHA:
            return gl.CONSTANT_ALPHA
        case TGDPainterBlendingFunc.ONE_MINUS_CONSTANT_ALPHA:
            return gl.ONE_MINUS_CONSTANT_ALPHA
        case TGDPainterBlendingFunc.SRC_ALPHA_SATURATE:
            return gl.SRC_ALPHA_SATURATE
    }
    throw Error(`Unknown equation: ${TGDPainterBlendingFunc[func]}!`)
}
