"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    create: create,
    getAttribs: getAttribs
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
/**
 * Return an object will all the active attributes of a given Program.
 * If an attribute is defined in a shader but not used, it will be removed
 * at compilation time. In that case, it will not be returned in this function.
 */
function getAttribs(gl, prg) {
    var attribs = {};
    var count = gl.getProgramParameter(prg, gl.ACTIVE_ATTRIBUTES);
    for (var location_1 = 0; location_1 < count; ++location_1) {
        var info = gl.getActiveAttrib(prg, location_1);
        if (!info)
            continue;
        var name_1 = info.name, size = info.size, type = info.type;
        attribs[info.name] = { name: name_1, location: location_1, size: size, type: type };
    }
    return attribs;
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