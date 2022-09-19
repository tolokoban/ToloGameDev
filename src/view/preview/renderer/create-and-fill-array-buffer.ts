import { interleaveFloat32 } from "@/tools/webgl/interleave-float32"
import { TGDPainterAttribute } from "@/types"

export function createAndFillArrayBuffer(
    gl: WebGL2RenderingContext,
    attributes: TGDPainterAttribute[]
): WebGLBuffer {
    const buffer = gl.createBuffer()
    if (!buffer) throw Error("Unable to create a WebGL32 Array Buffer!")

    const data = interleaveFloat32(
        ...(attributes.map((att) => [att.data, att.dim * att.size]) as Array<
            [data: number[], size: number]
        >)
    )
    console.log("🚀 [create-and-fill-array-buffer] data = ", data) // @FIXME: Remove this line written on 2022-08-23 at 19:16
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    console.log("const buffer = gl.createBuffer()")
    console.log("gl.bindBuffer(gl.ARRAY_BUFFER, buffer)")
    console.log(`gl.bufferData(
    gl.ARRAY_BUFFER, 
    new Float32Array([${data.join(",")}]), 
    gl.STATIC_DRAW
)`)
    return buffer
}
