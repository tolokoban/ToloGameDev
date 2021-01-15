"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var painter_1 = require("../../painter");
var texture_vert_1 = require("./texture.vert");
var texture_frag_1 = require("./texture.frag");
var matrix_2d_1 = require("../../../transformation/matrix-2d");
var TexturePainter = /** @class */ (function (_super) {
    __extends(TexturePainter, _super);
    function TexturePainter(scene, texture) {
        var _this = _super.call(this, scene) || this;
        _this.texture = texture;
        _this.transfo = new matrix_2d_1.default();
        _this.attPoint = 0;
        var buff = scene.gl.createBuffer();
        if (!buff)
            throw "Unable to create a WebGL Buffer!";
        _this.buff = buff;
        var gl = scene.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, +1, 0, 0,
            +1, +1, 1, 0,
            -1, -1, 0, 1,
            +1, -1, 1, 1
        ]), gl.STATIC_DRAW);
        _this.transfo.cover = true;
        return _this;
    }
    Object.defineProperty(TexturePainter.prototype, "id", {
        get: function () { return "TexturePainter"; },
        enumerable: false,
        configurable: true
    });
    TexturePainter.prototype.initializeCommon = function () {
        var scene = this.scene;
        var prg = scene.program.create({
            vert: texture_vert_1.default, frag: texture_frag_1.default
        });
        return { prg: prg };
    };
    TexturePainter.prototype.initialize = function (assets) {
        var gl = this.scene.gl;
        var prg = assets.prg;
        this.prg = prg;
        this.uniTransfo = uniLoc(gl, prg, "uniTransfo");
        this.uniTexture = uniLoc(gl, prg, "uniTexture");
        this.attPoint = gl.getAttribLocation(prg, 'attPoint');
    };
    TexturePainter.prototype.paint = function () {
        var _a = this, prg = _a.prg, scene = _a.scene, buff = _a.buff, transfo = _a.transfo, attPoint = _a.attPoint, uniTransfo = _a.uniTransfo;
        var z = this.transfo.z;
        var gl = scene.gl;
        transfo.eval(scene.width, scene.height);
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.useProgram(prg);
        gl.enableVertexAttribArray(attPoint);
        gl.vertexAttribPointer(attPoint, 4, gl.BYTE, false, 4, 0);
        gl.uniformMatrix3fv(uniTransfo, false, this.transfo.matrix);
        gl.uniform1f(this.uniTexture, 0);
        this.texture.activate();
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    TexturePainter.prototype.prepareNextFrame = function () { };
    TexturePainter.prototype.destroy = function () { };
    TexturePainter.prototype.destroyCommon = function () {
        var _a = this, scene = _a.scene, prg = _a.prg;
        var gl = scene.gl;
        gl.deleteProgram(prg);
    };
    return TexturePainter;
}(painter_1.default));
exports.default = TexturePainter;
function uniLoc(gl, prg, name) {
    var loc = gl.getUniformLocation(prg, name);
    if (!loc)
        throw "Uniform name not found: \"" + name + "\"!";
    return loc;
}
//# sourceMappingURL=texture-background.js.map