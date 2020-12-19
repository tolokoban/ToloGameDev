"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    create: create
};
function create(gl, shaders) {
    var prg = gl.createProgram();
    if (!prg)
        throw "Unable to create Program!";
    gl.attachShader(prg, loadVertexShader(gl, shaders.vert));
    gl.attachShader(prg, loadFragmentShader(gl, shaders.frag));
    gl.linkProgram(prg);
    // If creating the shader program failed, alert
    if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
        throw "Unable to link the shader program: " + gl.getProgramInfoLog(prg);
    }
    gl.useProgram(prg);
    return prg;
}
function loadVertexShader(gl, code) {
    try {
        return loadShader(gl, code, gl.VERTEX_SHADER);
    }
    catch (ex) {
        console.info(code);
        throw "Unable to compile VERTEX shader: " + ex;
    }
}
function loadFragmentShader(gl, code) {
    try {
        return loadShader(gl, code, gl.FRAGMENT_SHADER);
    }
    catch (ex) {
        console.info(code);
        throw "Unable to compile FRAGMENT shader: " + ex;
    }
}
function loadShader(gl, code, type) {
    var shader = gl.createShader(type);
    if (!shader)
        throw "Invalid shader type: " + type + "!";
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        var message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw message;
    }
    return shader;
}
//# sourceMappingURL=program.js.map