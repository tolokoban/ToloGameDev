class Data {
    private readonly data: ArrayBuffer
    private readonly buff: WebGLBuffer
    public cursor = 0

    constructor(
        private readonly gl: WebGL2RenderingContext | WebGLRenderingContext,
        private readonly attribsCount: number
    ) {
        this.data = new ArrayBuffer(attribsCount * 8)
        const buff = gl.createBuffer()
        if (!buff) throw "Unable to create a WebGL Buffer!"

        this.buff = buff
    }

    initVertexAttribPointer(prg: WebGLProgram) {
        const { gl, buff } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.useProgram(prg)
        gl.vertexAttribPointer(
            gl.getAttribLocation(prg, 'attPoint'),
            2, gl.SHORT, false,
            8, 0
        )
        gl.vertexAttribPointer(
            gl.getAttribLocation(prg, 'attColor'),
            3, gl.UNSIGNED_BYTE, true,
            8, 4
        )
    }

    set(
        attPoint1: number, attPoint2: number,
        attColor1: number, attColor2: number, attColor3: number
    ) {
        const { cursor, attribsCount } = this
        if (cursor < 0) throw "Cursor cannot be negative!"
        if (cursor >= attribsCount )
            throw `Cursor must be lesser than ${attribsCount}!`
        const view = new DataView(this.data, cursor * 8, 8)
        view.setInt16(0, attPoint1, true)
        view.setInt16(2, attPoint2, true)
        view.setUint8(4, attColor1)
        view.setUint8(5, attColor2)
        view.setUint8(6, attColor3)
        this.cursor++
    }

    sendToGPU() {
        const { gl, buff, data } = this
        gl.bindBuffer(gl.ARRAY_BUFFER, buff)
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW)
    }
}

// Get the only canvas of this page.
const canvas = document.querySelector("canvas")
if (!canvas) throw "No canvas in this page!"
// Create a WebGL context.
const gl = canvas.getContext("webgl")
if (!gl) throw "Unable to create WebGL context!"
// Create Program with two shaders: vertex and fragment.
const prg = createProgram(gl, {
  vert: `
attribute vec2 attPoint;
attribute vec3 attColor;
varying vec3 varColor;

void main() {
    varColor = attColor;
    gl_Position = vec4(attPoint / 10.0, 0.0, 1.0);
}`,
  frag: `precision mediump float;
varying vec3 varColor;
void main() {
    gl_FragColor = vec4(varColor, 1.0);
}
`
})
// Storing attributes data in GPU memory.
const data = new Data(gl, 3)
data.set(-7, -5, 255, 0, 0)
data.set(-1, +7, 0, 255, 0)
data.set(+5, -8, 0, 0, 255)
data.initVertexAttribPointer(prg)
data.sendToGPU()
render(0)

function render(time) {
  window.requestAnimationFrame(render)
  // Clearing the screen.
  gl.clearColor(0, 0.4, 0.867, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  // Drawing the triangle.
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

function createProgram(gl, shaders) {
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

function loadVertexShader(gl, code) {
    try {
        return loadShader(gl, code, gl.VERTEX_SHADER)
    } catch (ex) {
        console.info(code)
        throw `Unable to compile VERTEX shader: ${ex}`
    }
}

function loadFragmentShader(gl, code) {
    try {
        return loadShader(gl, code, gl.FRAGMENT_SHADER)
    } catch (ex) {
        console.info(code)
        throw `Unable to compile FRAGMENT shader: ${ex}`
    }
}

function loadShader(gl, code, type) {
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
