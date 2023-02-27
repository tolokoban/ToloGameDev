import { CodeBlock } from "./types"
import { computeStride } from "../../view/preview/renderer/compute-stride"
import { TGDPainterAttribute } from "../../types"
import {
    divideAttributes,
    TGDPainterAttrbutesGroup,
} from "../../view/preview/renderer/divide-attributes"
import { Code, ConfirmationNumberOutlined } from "@mui/icons-material"

export function generateVertexArrayObject(
    attributes: TGDPainterAttribute[],
    useElements: boolean
): CodeBlock {
    const bufferNames: string[] = []
    const code: CodeBlock = [
        "const vao = gl.createVertexArray()",
        `if (!vao) throw Error("Unable to create a WebGLVertexArrayObject!")`,
        "gl.bindVertexArray(vao)",
    ]
    const groups = divideAttributes(attributes)
    console.log("🚀 [generate-vertex-array-object] groups = ", groups) // @FIXME: Remove this line written on 2023-02-27 at 15:52
    for (const grp of groups) {
        if (grp.attributes.length === 0) continue

        const bufferName: string = makeBufferName(grp)
        bufferNames.push(bufferName)
        code.push(`gl.bindBuffer(gl.ARRAY_BUFFER, ${bufferName})`)
        const stride = computeStride(grp.attributes)
        let offset = 0
        for (const att of grp.attributes) {
            code.push(
                `const $${att.name} = gl.getAttribLocation(prg, "${att.name}") // ${att.type} ${att.name}[${att.dim}]`,
                `gl.enableVertexAttribArray($${att.name})`,
                `gl.vertexAttribPointer($${att.name}, ${
                    att.dim * att.size
                }, gl.FLOAT, false, ${stride}, ${offset})`,
                `gl.vertexAttribDivisor($${att.name}, ${att.divisor})`
            )
            offset += Float32Array.BYTES_PER_ELEMENT * att.dim * att.size
        }
    }
    if (useElements) {
        code.push(
            `const buffElem = gl.createBuffer()`,
            `if (!buffElem) throw Error("Unable to create buffer buffElem!")`,
            `gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffElem)`
        )
    }
    code.push("gl.bindVertexArray(null)", "return vao")
    return [
        `function createVAO(gl: WebGL2RenderingContext, prg: WebGLProgram, ${bufferNames
            .map((name) => `${name}: WebGLBuffer`)
            .join(", ")}): WebGLVertexArrayObject {`,
        code,
        "}",
    ]
}

export function makeBufferName(grp: TGDPainterAttrbutesGroup): string {
    if (grp.dynamic) {
        switch (grp.divisor) {
            case 0:
                return "buffVertDynamic"
            case 1:
                return "buffInstDynamic"
            default:
                return `buffInstBy${grp.divisor}Dynamic`
        }
    }
    switch (grp.divisor) {
        case 0:
            return "buffVert"
        case 1:
            return "buffInst"
        default:
            return `buffInstBy${grp.divisor}`
    }
}
