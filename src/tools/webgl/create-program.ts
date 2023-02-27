export function createProgram(
    gl: WebGL2RenderingContext,
    opts: {
        vert: string
        frag: string
    }
): WebGLProgram {
    const prg = gl.createProgram()
    if (!prg) throw Error("Unable to create WebGL Program!")

    const vertShader = gl.createShader(gl.VERTEX_SHADER)
    if (!vertShader) throw Error("Unable to create a Vertex Shader handle!")

    gl.shaderSource(vertShader, opts.vert)
    gl.compileShader(vertShader)
    gl.attachShader(prg, vertShader)
    const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
    if (!fragShader) throw Error("Unable to create a Fragment Shader handle!")

    gl.shaderSource(fragShader, opts.frag)
    gl.compileShader(fragShader)
    gl.attachShader(prg, fragShader)
    gl.linkProgram(prg)
    return prg
}
