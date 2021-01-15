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
var painter_1 = require("../painter");
var shape_vert_1 = require("./shape.vert");
var shape_frag_1 = require("./shape.frag");
var matrix_2d_1 = require("../../transformation/matrix-2d");
var RED = 0;
var GREEN = 1;
var BLUE = 2;
var ALPHA = 3;
var ShapePainter = /** @class */ (function (_super) {
    __extends(ShapePainter, _super);
    function ShapePainter(scene, data) {
        var _this = _super.call(this, scene) || this;
        _this.color = new Float32Array([1, 0.5, 0, 1]);
        _this.transfo = new matrix_2d_1.default();
        var buff = scene.gl.createBuffer();
        if (!buff)
            throw "Unable to create a WebGL Buffer!";
        _this.buff = buff;
        var gl = scene.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        _this.verticesCount = data.length >> 1;
        return _this;
    }
    Object.defineProperty(ShapePainter.prototype, "red", {
        get: function () { return this.color[RED]; },
        set: function (v) { this.color[RED] = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapePainter.prototype, "blue", {
        get: function () { return this.color[BLUE]; },
        set: function (v) { this.color[BLUE] = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapePainter.prototype, "green", {
        get: function () { return this.color[GREEN]; },
        set: function (v) { this.color[GREEN] = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapePainter.prototype, "alpha", {
        get: function () { return this.color[ALPHA]; },
        set: function (v) { this.color[ALPHA] = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapePainter.prototype, "id", {
        get: function () { return "ShapePainter"; },
        enumerable: false,
        configurable: true
    });
    ShapePainter.prototype.initializeCommon = function () {
        var scene = this.scene;
        var prg = scene.program.create({
            vert: shape_vert_1.default, frag: shape_frag_1.default
        });
        return { prg: prg };
    };
    ShapePainter.prototype.initialize = function (assets) {
        var gl = this.scene.gl;
        var prg = assets.prg;
        this.prg = prg;
        gl.useProgram(prg);
        this.uniTransfo = uniLoc(gl, prg, "uniTransfo");
        this.uniZ = uniLoc(gl, prg, "uniZ");
        this.uniColor = uniLoc(gl, prg, "uniColor");
        console.log("initialized!");
    };
    ShapePainter.prototype.paint = function () {
        var _a = this, prg = _a.prg, scene = _a.scene, buff = _a.buff, verticesCount = _a.verticesCount, color = _a.color, transfo = _a.transfo, uniZ = _a.uniZ, uniColor = _a.uniColor, uniTransfo = _a.uniTransfo;
        var z = this.transfo.z;
        var gl = scene.gl;
        transfo.eval(scene.width, scene.height);
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.useProgram(prg);
        gl.enableVertexAttribArray(gl.getAttribLocation(prg, 'attPoint'));
        gl.vertexAttribPointer(gl.getAttribLocation(prg, 'attPoint'), 2, gl.FLOAT, false, 8, 0);
        gl.uniform1f(uniZ, z);
        gl.uniform4fv(uniColor, color);
        gl.uniformMatrix3fv(uniTransfo, false, this.transfo.matrix);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, verticesCount);
    };
    ShapePainter.prototype.prepareNextFrame = function () { };
    ShapePainter.prototype.destroy = function () { };
    ShapePainter.prototype.destroyCommon = function () { };
    /**
     * Create a shape from a list of pairs of numbers (x,y).
     * The result will be a fan, so the first two values are often (0,0).
     */
    ShapePainter.Any = function (scene, data) {
        return new ShapePainter(scene, data);
    };
    ShapePainter.Disk = function (scene, radius, steps) {
        if (radius === void 0) { radius = 1; }
        if (steps === void 0) { steps = 32; }
        var data = new Float32Array(2 + steps << 1);
        data[0] = 0;
        data[1] = 0;
        var angStep = Math.PI * 2 / steps;
        var ptr = 2;
        for (var i = 0; i < steps; i++) {
            var ang = angStep * i;
            data[ptr++] = radius * Math.sin(ang);
            data[ptr++] = radius * Math.cos(ang);
        }
        data[ptr++] = 0;
        data[ptr++] = radius;
        return new ShapePainter(scene, data);
    };
    ShapePainter.Arrow = function (scene, radius, angle, depth) {
        if (radius === void 0) { radius = 1; }
        if (angle === void 0) { angle = 1; }
        if (depth === void 0) { depth = 0.66667; }
        var x = radius * depth * Math.sin(Math.PI - angle);
        var y = radius * depth * Math.cos(Math.PI - angle);
        var data = new Float32Array([
            0, 0,
            x, y,
            0, radius,
            -x, y
        ]);
        return new ShapePainter(scene, data);
    };
    return ShapePainter;
}(painter_1.default));
exports.default = ShapePainter;
function uniLoc(gl, prg, name) {
    var loc = gl.getUniformLocation(prg, name);
    if (!loc)
        throw "Uniform name not found: \"" + name + "\"!";
    return loc;
}
//# sourceMappingURL=shape-painter.js.map