"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    create: createProgram,
    getAttribs: getAttribs
};
function createProgram(gl, shaders) {
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
var RX_ERROR_MESSAGE = /ERROR: ([0-9]+):([0-9]+):/g;
/**
 * Return a portion of the code that is two lines before the error and two lines after.
 */
function getCodeSection(code, errorMessage) {
    var lines = code.split(/\n\r?/);
    lines.unshift(""); // Because lines numbers start at 1
    RX_ERROR_MESSAGE.lastIndex = -1; // Reinit RegExp
    var matcher = RX_ERROR_MESSAGE.exec(errorMessage);
    if (!matcher) {
        return code;
    }
    var SURROUNDING_LINES = 2;
    var _a = __read(matcher, 3), lineNumberMatch = _a[2];
    var lineNumber = Number(lineNumberMatch);
    var firstLine = Math.max(1, lineNumber - SURROUNDING_LINES);
    var lastLine = Math.min(lines.length - 1, lineNumber + SURROUNDING_LINES);
    var outputLines = ["Here is an extract of the shader code:"];
    for (var n = firstLine; n <= lastLine; n++) {
        outputLines.push("| " + n + ":    " + lines[n]);
    }
    return outputLines.join("\n");
}
//# sourceMappingURL=program.js.map