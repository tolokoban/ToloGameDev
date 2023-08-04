import { generateBlendTest } from "@/factory/code/generate-blend-test"
import { generateDepthTest } from "@/factory/code/generate-depth-test"
import { generateVertexArrayObject } from "@/factory/code/generate-vertex-array-object"
import { linearize } from "@/factory/code/linearize"
import { CodeBlock } from "@/factory/code/types"
import { TGDPainter, TGDPainterUniform } from "@/types"

export function generateSingleFileScript(painter: TGDPainter): string {
    const code: CodeBlock = [
        `// Vertex Shader`,
        `const VERT = \`${painter.shader.vert.trim()}\``,
        `// Fragment Shader`,
        `const FRAG = \`${painter.shader.frag.trim()}\``,
        ...generateAttributes(painter),
        ...generateElements(painter),
        ...generateCreateVertexBuffer(),
        ...generateVertexArrayObject(
            painter.attributes,
            painter.elements.length > 0
        ),
        ...generateCreateWebGL(painter),
        ...generateCreateProgram(),
        ...generateMain(painter),
    ]

    return linearize(code)
}

function generateAttributes(painter: TGDPainter): CodeBlock {
    const code: CodeBlock = [
        "const Attributes = {",
        painter.attributes.map((att) =>
            att.dim === 1
                ? [
                      `${att.name}: /* ${att.type} */ ${JSON.stringify(
                          att.data
                      )},`,
                  ]
                : [
                      `${att.name}: /* ${att.type}[${att.dim}] */ [`,
                      groupData(att.data, att.dim).map(
                          (data) => `${data.join(", ")},`
                      ),
                      "],",
                  ]
        ),
        "}",
    ]
    if (painter.attributes.length > 1) {
        code.push(
            ...generateInterleaveFloat32(),
            "",
            "const Data = interleaveFloat32(",
            painter.attributes.map(
                (att) => `[Attributes.${att.name}, ${att.dim}],`
            ),
            ")"
        )
    } else {
        code.push(
            `const Data = new Float32Array(Attributes.${painter.attributes[0].name})`
        )
    }

    return code
}

function generateInterleaveFloat32() {
    return [
        "",
        "function interleaveFloat32(",
        ["...inputs: Array<[data: number[], size: number]>"],
        "): Float32Array {",
        [
            "const attributeSize = inputs",
            [
                ".map(([_data, size]) => size)",
                ".reduce((total, value) => total + value, 0)",
            ],
            "if (attributeSize <= 0) return new Float32Array()",
            "const attributesCount = inputs",
            [
                ".map(([data, size]) => Math.floor(data.length / size))",
                ".reduce((previous, current) => Math.min(previous, current), 1e10)",
            ],
            "const offsets = inputs.map(() => 0)",
            "const array = new Float32Array(attributeSize * attributesCount)",
            "let cursor = 0",
            "for (let k = 0; k < attributesCount; k++) {",
            [
                "for (let idx = 0; idx < inputs.length; idx++) {",
                [
                    "const [data, size] = inputs[idx]",
                    "let offset = offsets[idx]",
                    "for (let j = 0; j < size; j++) {",
                    ["array[cursor++] = data[offset++]"],
                    "}",
                    "offsets[idx] = offset",
                ],
                "}",
            ],
            "}",
            "return array",
        ],
        "}",
    ]
}

function groupData(data: number[], dim: number) {
    const groups: number[][] = []
    let group: number[] = []
    for (const item of data) {
        group.push(item)
        if (group.length === dim) {
            groups.push(group)
            group = []
        }
    }
    return groups
}

function generateElements(painter: TGDPainter): CodeBlock {
    if (painter.elements.length === 0) return []

    return [
        `const Elem = new Uint${figureOutWordSize(
            painter.elements.length
        )}Array(${JSON.stringify(painter.elements)})`,
    ]
}

function figureOutWordSize(length: number) {
    if (length < 256) return "8"
    if (length < 256 * 256) return "16"
    return "32"
}

function generateCreateWebGL(painter: TGDPainter): CodeBlock {
    const canvas = document.createElement("canvas")
    const gl = canvas.getContext("webgl2", {
        alpha: false,
        antialias: false,
        depth: painter.depth.enabled,
        stencil: false,
        desynchronized: true,
        powerPreference: "high-performance", // "low-power"
        premultipliedAlpha: false,
        preserveDrawingBuffer: true,
    })
    return [
        "function createWebGL(canvas: HTMLCanvasElement): WebGL2RenderingContext {",
        [
            `const gl = canvas.getContext("webgl2", {`,
            [
                `alpha: false,`,
                `antialias: false,`,
                `depth: ${painter.depth.enabled},`,
                `stencil: false,`,
                `desynchronized: true,`,
                `powerPreference: "high-performance", // "low-power"`,
                `premultipliedAlpha: false,`,
                `preserveDrawingBuffer: true,`,
            ],
            "})",
            `if (!gl) throw Error("Unable to create webgl2 context!")`,
            "return gl",
        ],
        "}",
    ]
}

function generateCreateProgram() {
    return [
        `function createProgram(`,
        [
            `gl: WebGL2RenderingContext,`,
            `opts: {`,
            [`vert: string`, `frag: string`],
            `}`,
        ],
        `): WebGLProgram {`,
        [
            `const prg = gl.createProgram()`,
            `if (!prg) throw Error("Unable to create WebGL Program!")`,
            ``,
            `const vertShader = gl.createShader(gl.VERTEX_SHADER)`,
            `if (!vertShader) throw Error("Unable to create a Vertex Shader handle!")`,
            ``,
            `gl.shaderSource(vertShader, opts.vert)`,
            `gl.compileShader(vertShader)`,
            `gl.attachShader(prg, vertShader)`,
            `const fragShader = gl.createShader(gl.FRAGMENT_SHADER)`,
            `if (!fragShader) throw Error("Unable to create a Fragment Shader handle!")`,
            ``,
            `gl.shaderSource(fragShader, opts.frag)`,
            `gl.compileShader(fragShader)`,
            `gl.attachShader(prg, fragShader)`,
            `gl.linkProgram(prg)`,
            `return prg`,
        ],
        `}    `,
    ]
}

function generateCreateVertexBuffer(): CodeBlock {
    const code: CodeBlock = [
        "function createVertexBuffer(gl: WebGL2RenderingContext) {",
        [
            "const buff = gl.createBuffer()",
            "if (!buff) throw 'Unable to create a WebGL Buffer!'",
            "gl.bindBuffer(gl.ARRAY_BUFFER, buff)",
            "gl.bufferData(gl.ARRAY_BUFFER, Data, gl.STATIC_DRAW)",
            "return buff",
        ],
        "}",
    ]
    return code
}

function generateMain(painter: TGDPainter): CodeBlock {
    const draw: CodeBlock = []
    if (painter.count.instance > 0) {
        if (painter.count.element > 0) {
            draw.push(
                "gl.drawElementsInstanced(",
                [
                    `gl.${painter.mode},`,
                    `${painter.count.element},`,
                    "gl.UNSIGNED_SHORT,",
                    "0,",
                    `${painter.count.instance}`,
                ],
                ")"
            )
        } else {
            draw.push(
                "gl.drawArraysInstanced(",
                [
                    `gl.${painter.mode},`,
                    `0,`,
                    `${painter.count.vertex},`,
                    `${painter.count.instance}`,
                ],
                ")"
            )
        }
    } else {
        if (painter.count.element > 0) {
            draw.push(
                "gl.drawElements(",
                [
                    `gl.${painter.mode},`,
                    `${painter.count.element},`,
                    "gl.UNSIGNED_SHORT,",
                    "0",
                ],
                ")"
            )
        } else {
            draw.push(
                `gl.drawArrays(gl.${painter.mode}, 0, ${painter.count.vertex})`
            )
        }
    }
    const code: CodeBlock = [
        "",
        "// ##########################################",
        "",
        "const canvas = document.getElementById('canvas')",
        `if (!canvas || canvas.tagName !== "CANVAS") throw Error("Can't find any Canvas element with id \\"canvas\\"!")`,
        "const gl = createWebGL(canvas as HTMLCanvasElement)",
        "const prg = createProgram(gl, { vert: VERT, frag: FRAG })",
        ...generateUniforms(painter.uniforms),
        "const buff = createVertexBuffer(gl)",
        "const vao = createVAO(gl, prg, buff)",
        ...generateBlendTest(painter.blending),
        ...generateDepthTest(painter.depth),
        "gl.clearColor(0, 0, 0, 1)",
        "let lastWidth = 0",
        "let lastHeight = 0",
        "function paint(time: number) {",
        [
            "const w = canvas.clientWidth",
            "const h = canvas.clientHeight",
            "if (w !== lastWidth || h !== lastHeight) {",
            [
                "canvas.width = w",
                "canvas.height = h",
                "lastWidth = w",
                "lastHeight = h",
                "gl.viewport(0, 0, w, h)",
            ],
            "}",
            "gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)",
            "gl.useProgram(prg)",
            ...generateUniformsUpdate(painter.uniforms),
            "gl.bindVertexArray(vao)",
            ...draw,
            "window.requestAnimationFrame(paint)",
        ],
        "}",
        "window.requestAnimationFrame(paint)",
    ]
    return code
}

function generateUniforms(uniforms: TGDPainterUniform[]): CodeBlock {
    const activeUniforms = uniforms.filter((uni) => uni.active)
    if (activeUniforms.length === 0) return []

    return [
        "const uniforms = {",
        activeUniforms.map(
            (uni) => `${uni.name}: gl.getUniformLocation(prg, "${uni.name}"),`
        ),
        "}",
    ]
}

function generateUniformsUpdate(uniforms: TGDPainterUniform[]): CodeBlock {
    const activeUniforms = uniforms.filter((uni) => uni.active)
    if (activeUniforms.length === 0) return []

    return activeUniforms.map((uni) => {
        switch (uni.data.type) {
            case "Time":
                return `gl.uniform1f(uniforms.${uni.name}, time)`
            default:
                return `// Don't know how to update this uniform: ${JSON.stringify(
                    uni
                )}`
        }
    })
}
