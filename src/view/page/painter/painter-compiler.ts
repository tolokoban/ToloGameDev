import { getConstName } from "@/tools/webgl/get-const-name"
import { PainterUpdater } from "./hooks/painter-updater"
import { TGDShaderAttribute } from "@/types"

export default class PainterCompiler {
    private readonly gl: WebGL2RenderingContext

    /**
     * Compiles the shaders and fill the `painter.attributes` array.
     * @returns `null` in case of success. The error message otherwise.
     */
    async compile(updater: PainterUpdater): Promise<void> {
        try {
            const canvas = document.createElement("canvas")
            const gl = canvas.getContext("webgl2")
            if (!gl) throw Error("Unable to create a WebGL2 context!")

            const painter = updater.currentPainter
            updater.clearError()
            if (painter.count.element > 0) {
                // Check elements.
                if (painter.elements.length < painter.count.element) {
                    throw Error(
                        `You want to draw ${painter.count.element} elements but your array has only ${painter.elements.length} elements!`
                    )
                }
            }
            console.log(`const VERT = \`${painter.shader.vert}\``)
            console.log(`const FRAG = \`${painter.shader.frag}\``)
            const prg = createProgram(gl)
            linkVertShader(gl, prg, painter.shader.vert)
            linkFragShader(gl, prg, painter.shader.frag)
            gl.linkProgram(prg)
            if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
                var info = gl.getProgramInfoLog(prg)
                throw new Error("Could NOT link WebGL2 program!\n" + info)
            }
            updater.deactivateAttributes()
            extractAttributes(gl, prg).forEach((att: TGDShaderAttribute) => {
                const { name } = att
                updater.updateAttribute(name, {
                    type: att.type,
                    dim: att.dim,
                    size: att.size,
                    active: true,
                })
            })
            await updater.validate()
        } catch (ex) {
            if (ex instanceof Error) updater.setError(ex.message)
            updater.setError(`${ex}`)
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
): TGDShaderAttribute[] {
    const attributes: TGDShaderAttribute[] = []
    const count = gl.getProgramParameter(prg, gl.ACTIVE_ATTRIBUTES) as number
    for (let index = 0; index < count; index++) {
        const att = gl.getActiveAttrib(prg, index)
        if (!att) continue
        if (["gl_InstanceID", "gl_VertexID"].includes(att.name)) continue

        const location = gl.getAttribLocation(prg, att.name)
        if (location < 0) {
            console.warn("Unused attribute:", att.name)
            continue
        }

        attributes.push({
            name: att?.name,
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
        case gl.FLOAT_MAT2:
            return 4
        case gl.FLOAT_MAT3:
            return 9
        case gl.FLOAT_MAT4:
            return 16
        default:
            throw Error(
                `Don't know how to deal with type "${getConstName(gl, type)}"!`
            )
    }
}
