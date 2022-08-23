import { TGDPainter } from "@/types"

export function createAndFillElementArrayBuffer(
    gl: WebGL2RenderingContext,
    painter: TGDPainter
): WebGLBuffer {
    const buffer = gl.createBuffer()
    if (!buffer) throw Error("Unable to create a WebGL32 Array Buffer!")

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer)
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(painter.preview.data.elements ?? []),
        gl.STATIC_DRAW
    )
    return buffer
}
