export function createVertexArray(
    gl: WebGL2RenderingContext
): WebGLVertexArrayObject {
    const vertexArray = gl.createVertexArray()
    if (!vertexArray) throw Error("Unable to create Vertex Array Object!")

    return vertexArray
}
