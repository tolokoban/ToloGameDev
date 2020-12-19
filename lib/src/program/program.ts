import { IWebGL, IShaders } from '../types'

export default {
    create
}

function create(gl: IWebGL, shaders: IShaders) {
    console.log("[program] gl, shaders = ", gl, shaders) // @FIXME: Remove this line written on 2020-12-19 at 21:35
    const prg = gl.createProgram()
    if (!prg) throw "Unable to create Program!"

    gl.attachShader(prg, loadVertexShader(gl, shaders.vert))
    gl.attachShader(prg, loadFragmentShader(gl, shaders.frag))
    gl.linkProgram(prg)
    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        throw `Unable to link the shader program: ${gl.getProgramInfoLog(prg)}`
    }
    gl.useProgram(prg)

    return prg
}

function loadVertexShader(gl: WebGLRenderingContext, code: string) {
    try {
        return loadShader(gl, code, gl.VERTEX_SHADER)
    } catch (ex) {
        console.info(code)
        throw `Unable to compile VERTEX shader: ${ex}`
    }
}

function loadFragmentShader(gl: WebGLRenderingContext, code: string) {
    try {
        return loadShader(gl, code, gl.FRAGMENT_SHADER)
    } catch (ex) {
        console.info(code)
        throw `Unable to compile FRAGMENT shader: ${ex}`
    }
}

function loadShader(gl: WebGLRenderingContext, code: string, type: number) {
    const shader = gl.createShader(type)
    if (!shader) throw `Invalid shader type: ${type}!`

    gl.shaderSource(shader, code)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const message = gl.getShaderInfoLog(shader)
        gl.deleteShader(shader)
        throw message
    }

    return shader
}
