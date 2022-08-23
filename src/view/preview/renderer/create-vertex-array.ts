export function createVertexArray(
    gl: WebGL2RenderingContext
): WebGLVertexArrayObject {
    const vertexArray = gl.createVertexArray()
    if (!vertexArray) throw Error("Unable to create WebGL2 Vertex Array!")

    return vertexArray
}
