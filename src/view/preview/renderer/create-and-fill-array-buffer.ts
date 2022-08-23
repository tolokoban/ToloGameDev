import { interleaveFloat32 } from "@/tools/webgl/interleave-float32"
import { TGDPainter } from "@/types"

export function createAndFillArrayBuffer(
    gl: WebGL2RenderingContext,
    painter: TGDPainter
): WebGLBuffer {
    const buffer = gl.createBuffer()
    if (!buffer) throw Error("Unable to create a WebGL32 Array Buffer!")

    const data = interleaveFloat32(
        ...(painter.attributes.map((att) => [
            painter.preview.data.attributes[att.name] ?? [],
            att.dim * att.size,
        ]) as Array<[data: number[], size: number]>)
    )
    console.log("🚀 [create-and-fill-array-buffer] data = ", data) // @FIXME: Remove this line written on 2022-08-23 at 19:16
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    return buffer
}
