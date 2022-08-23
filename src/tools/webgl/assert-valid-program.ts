export function assertValidProgram(
    gl: WebGL2RenderingContext,
    prg: WebGLProgram
) {
    gl.validateProgram(prg)
    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(prg)
        throw new Error(`Could NOT link WebGL2 program!\n${info}`)
    }
}
