import { getConstName } from "./get-const-name"
import { TGDPainter, TGDPainterAttribute } from "../../types"
export default class ShadersCompiler {
    private readonly gl: WebGL2RenderingContext

    constructor() {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("webgl2")
        if (!ctx) throw Error("Unable to create a WebGL2 context!")

        this.gl = ctx
    }

    /**
     * Compiles the shaders and fill the `painter.attributes` array.
     * @returns `null` in case of success. The error message otherwise.
     */
    compile(painter: TGDPainter): null | string {
        const { gl } = this
        try {
            const prg = createProgram(gl)
            linkVertShader(gl, prg, painter.vertexShader)
            linkFragShader(gl, prg, painter.fragmentShader)
            gl.linkProgram(prg)
            if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
                var info = gl.getProgramInfoLog(prg)
                throw new Error("Could NOT link WebGL2 program!\n" + info)
            }
            painter.attributes = extractAttributes(gl, prg)
            return null
        } catch (ex) {
            if (ex instanceof Error) return ex.message
            return `${ex}`
        }
    }
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram {
    const prg = gl.createProgram()
    if (!prg) throw Error("Unable to create WebGL Program!")

    return prg
}

function linkVertShader(
    gl: WebGLRenderingContext,
    prg: WebGLProgram,
    code: string
): string | WebGLShader {
    try {
        const shader = getShader(gl.VERTEX_SHADER, gl, code)
        gl.attachShader(prg, shader)
        return shader
    } catch (ex) {
        throw Error(`<VERT>${makePrettyError(code, ex)}`)
    }
}

function linkFragShader(
    gl: WebGLRenderingContext,
    prg: WebGLProgram,
    code: string
): string | WebGLShader {
    try {
        const shader = getShader(gl.FRAGMENT_SHADER, gl, code)
        gl.attachShader(prg, shader)
        return shader
    } catch (ex) {
        throw Error(`<FRAG>${makePrettyError(code, ex)}`)
    }
}

const RX_ERROR = /^(ERROR|WARNING): [0-9]+:([0-9]+)/gu

function makePrettyError(code: string, ex: unknown): string {
    const lines = code.split("\n")
    const text = ex instanceof Error ? ex.message : JSON.stringify(ex)
    const setLinesToPrint = new Set<number>()
    const setErrorLines = new Set<number>()
    for (const line of text.split("\n")) {
        RX_ERROR.lastIndex = -1
        const match = RX_ERROR.exec(line)
        if (match) {
            const [_all, _type, num] = match
            const lineNumber = parseInt(num)
            if (!isNaN(lineNumber)) {
                setErrorLines.add(lineNumber)
                for (let shift = -2; shift <= +2; shift++) {
                    const num = lineNumber + shift
                    if (num < 1 || num > lines.length) continue

                    setLinesToPrint.add(num)
                }
            }
        }
    }
    const preview: string[] = []
    const linesToPrint = Array.from(setLinesToPrint).sort()
    let previousLineNumber = 0
    for (const num of linesToPrint) {
        if (num - previousLineNumber > 1) preview.push("")
        previousLineNumber = num
        const prefix = setErrorLines.has(num) ? ">" : " "
        let paddedLineNum = `${num}`
        while (paddedLineNum.length < 7) paddedLineNum = ` ${paddedLineNum}`
        const line = lines[num - 1]
        preview.push(`${prefix}${paddedLineNum} | ${line}`)
    }
    return `${text}
${preview.join("\n")}`
}

function getShader(
    type: number,
    gl: WebGLRenderingContext,
    code: string
): WebGLShader {
    const shader = gl.createShader(type)
    if (!shader) {
        throw Error(`Unable to create a WebGL shader of type ${type}!`)
    }
    gl.shaderSource(shader, code)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw Error(
            gl.getShaderInfoLog(shader) ??
                "Unknow error while compiling the shader!"
        )
    }

    return shader
}

function extractAttributes(
    gl: WebGL2RenderingContext,
    prg: WebGLProgram
): TGDPainterAttribute[] {
    const attributes: TGDPainterAttribute[] = []
    const count = gl.getProgramParameter(prg, gl.ACTIVE_ATTRIBUTES) as number
    for (let index = 0; index < count; index++) {
        const att = gl.getActiveAttrib(prg, index)
        if (!att) continue
        // if (!att || ["gl_InstanceID"].includes(att.name)) continue

        attributes.push({
            name: att?.name,
            divisor: 0,
            dynamicGroup: 0,
            type: "float",
            size: att.size,
            dim: getDimension(gl, att.type),
        })
    }
    return attributes
}

function getDimension(gl: WebGLRenderingContext, type: number) {
    switch (type) {
        case gl.FLOAT:
            return 1
        case gl.FLOAT_VEC2:
            return 2
        case gl.FLOAT_VEC3:
            return 3
        case gl.FLOAT_VEC4:
            return 4
        default:
            throw Error(
                `Don't know how to deal with type "${getConstName(gl, type)}"!`
            )
    }
}
