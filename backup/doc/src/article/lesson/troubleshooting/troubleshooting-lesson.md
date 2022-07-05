# Protecting ourselves against Shader errors

To check if your shader code is correct, you can use a function like `createProgram( gl, { vert: "...", frag: "..." } )`:

```js
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
```