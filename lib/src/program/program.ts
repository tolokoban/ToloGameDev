import { IWebGL, IShaders, IAttribute } from '../types'


export default {
    create,
    getAttribs
}


function create(gl: IWebGL, shaders: IShaders) {
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

/**
 * Return an object will all the active attributes of a given Program.
 * If an attribute is defined in a shader but not used, it will be removed
 * at compilation time. In that case, it will not be returned in this function.
 */
function getAttribs(gl: IWebGL, prg: WebGLProgram): { [key: string]: IAttribute } {
    const attribs: { [key: string]: IAttribute } = {}
    const count = gl.getProgramParameter(prg, gl.ACTIVE_ATTRIBUTES)
    for (let location = 0; location < count; ++location) {
        const info = gl.getActiveAttrib(prg, location)
        if (!info) continue

        const { name, size, type } = info
        attribs[info.name] = { name, location, size, type }
    }

    return attribs
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
