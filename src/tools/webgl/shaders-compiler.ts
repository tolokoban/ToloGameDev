import { TGDShaders } from "./../../types"
export default class ShadersCompiler {
    private readonly gl: WebGL2RenderingContext

    constructor() {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("webgl2")
        if (!ctx) throw Error("Unable to create a WebGL2 context!")

        this.gl = ctx
    }

    /**
     * @returns `null` in case of success. The error message otherwise.
     */
    compile(shaders: TGDShaders): null | string {
        const { gl } = this
        try {
            const prg = createProgram(gl)
            linkVertShader(gl, prg, shaders.vertexShader)
            linkFragShader(gl, prg, shaders.fragmentShader)
            gl.linkProgram(prg)
            if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
                var info = gl.getProgramInfoLog(prg)
                throw new Error("Could NOT link WebGL2 program!\n" + info)
            }
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
