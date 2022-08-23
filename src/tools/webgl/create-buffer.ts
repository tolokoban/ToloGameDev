export function createBuffer(gl: WebGL2RenderingContext): WebGLBuffer {
    const buff = gl.createBuffer()
    if (!buff) throw Error("Unable to create a WebGL Buffer!")

    return buff
}

export function createArrayBuffer(
    gl: WebGL2RenderingContext,
    data: Float32Array,
    dynamic = false
): WebGLBuffer {
    const buff = gl.createBuffer()
    if (!buff) throw Error("Unable to create a WebGL Buffer!")

    gl.bindBuffer(gl.ARRAY_BUFFER, buff)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        data,
        dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW
    )
    console.log("🚀 [create-buffer] data = ", data) // @FIXME: Remove this line written on 2022-08-22 at 19:59
    return buff
}
