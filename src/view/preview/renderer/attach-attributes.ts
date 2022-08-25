import { computeStride } from "./compute-stride"
import { TGDPainterAttribute } from "@/types"

export function attachAttributes(
    gl: WebGL2RenderingContext,
    prg: WebGLProgram,
    attributes: TGDPainterAttribute[]
) {
    gl.useProgram(prg)
    const BPE = Float32Array.BYTES_PER_ELEMENT
    const stride: number = computeStride(attributes)
    let offset = 0
    for (const att of attributes) {
        const location = gl.getAttribLocation(prg, att.name)
        gl.enableVertexAttribArray(location)
        gl.vertexAttribPointer(
            location,
            att.dim * att.size,
            gl.FLOAT,
            false,
            stride,
            offset
        )
        gl.vertexAttribDivisor(location, att.divisor)
        console.log(
            `const _${att.name} = gl.getAttribLocation(prg, "${att.name}")`
        )
        console.log(`gl.enableVertexAttribArray(_${att.name})`)
        console.log(
            `gl.vertexAttribPointer(_${att.name}, ${
                att.dim * att.size
            }, gl.FLOAT, false, ${stride}, ${offset})`
        )
        console.log(`gl.vertexAttribDivisor(_${att.name}, ${att.divisor})`)
        offset += BPE * att.dim * att.size
    }
}
