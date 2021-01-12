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
var ShapePainter = /** @class */ (function (_super) {
    __extends(ShapePainter, _super);
    function ShapePainter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.color = new Float32Array([1, 0.5, 0, 1]);
        _this.x = 0;
        _this.y = 0;
        _this.z = 0.5;
        _this.scale = 1;
        _this.rotation = 0;
        _this.cover = false;
        _this.verticesCount = 0;
        return _this;
    }
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
        var buff = gl.createBuffer();
        if (!buff)
            throw "Unable to create a WebGL Buffer!";
        var prg = assets.prg;
        this.buff = buff;
        this.prg = prg;
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.useProgram(prg);
        gl.enableVertexAttribArray(gl.getAttribLocation(prg, 'attPoint'));
        gl.vertexAttribPointer(gl.getAttribLocation(prg, 'attPoint'), 2, gl.FLOAT, false, 8, 0);
        this.uniX = uniLoc(gl, prg, "uniX");
        this.uniY = uniLoc(gl, prg, "uniY");
        this.uniZ = uniLoc(gl, prg, "uniZ");
        this.uniColor = uniLoc(gl, prg, "uniColor");
        this.uniScale = uniLoc(gl, prg, "uniScale");
        console.log("initialized!");
    };
    ShapePainter.prototype.paint = function () {
        var _a = this, prg = _a.prg, scene = _a.scene, buff = _a.buff, verticesCount = _a.verticesCount, x = _a.x, y = _a.y, z = _a.z, color = _a.color, scale = _a.scale, uniX = _a.uniX, uniY = _a.uniY, uniZ = _a.uniZ, uniColor = _a.uniColor, uniScale = _a.uniScale;
        var gl = scene.gl;
        gl.useProgram(prg);
        gl.uniform1f(uniX, x);
        gl.uniform1f(uniY, y);
        gl.uniform1f(uniZ, z);
        gl.uniform4fv(uniColor, color);
        gl.uniform1f(uniScale, scale);
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.drawArrays(gl.TRIANGLE_FAN, 0, verticesCount);
    };
    ShapePainter.prototype.prepareNextFrame = function () { };
    ShapePainter.prototype.destroy = function () { };
    ShapePainter.prototype.destroyCommon = function () { };
    ShapePainter.prototype.makeDisk = function (radius, steps) {
        if (radius === void 0) { radius = 1; }
        if (steps === void 0) { steps = 32; }
        var data = new Float32Array(2 + steps << 1);
        data[0] = 0;
        data[1] = 0;
        var angStep = Math.PI * 2 / steps;
        var ptr = 2;
        for (var i = 0; i < steps; i++) {
            var ang = angStep * i;
            data[ptr++] = radius * Math.cos(ang);
            data[ptr++] = radius * Math.sin(ang);
        }
        data[ptr++] = radius;
        data[ptr++] = 0;
        this.points = data;
    };
    Object.defineProperty(ShapePainter.prototype, "points", {
        set: function (data) {
            var _a = this, buff = _a.buff, scene = _a.scene;
            var gl = scene.gl;
            console.log("[shape-painter] data = ", data); // @FIXME: Remove this line written on 2021-01-12 at 22:34
            gl.bindBuffer(gl.ARRAY_BUFFER, buff);
            gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
            this.verticesCount = data.length >> 1;
            console.log("[shape-painter] this.verticesCount = ", this.verticesCount); // @FIXME: Remove this line written on 2021-01-12 at 22:39
        },
        enumerable: false,
        configurable: true
    });
    return ShapePainter;
}(painter_1.default));
exports.default = ShapePainter;
function uniLoc(gl, prg, name) {
    var loc = gl.getUniformLocation(prg, name);
    if (!loc)
        throw "Uniform name not found: \"" + name + "\"!";
    return loc;
}
var Data = /** @class */ (function () {
    function Data(gl, attribsCount) {
        this.gl = gl;
        this.attribsCount = attribsCount;
        this.cursor = 0;
        this.data = new ArrayBuffer(attribsCount * 4);
        var buff = gl.createBuffer();
        if (!buff)
            throw "Unable to create a WebGL Buffer!";
        this.buff = buff;
    }
    Data.prototype.init = function (prg) {
        var _a = this, gl = _a.gl, buff = _a.buff;
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.useProgram(prg);
        gl.enableVertexAttribArray(gl.getAttribLocation(prg, 'attPoint'));
        gl.vertexAttribPointer(gl.getAttribLocation(prg, 'attPoint'), 2, gl.BYTE, false, 4, 0);
    };
    Data.prototype.set = function (attPoint1, attPoint2) {
        var _a = this, cursor = _a.cursor, attribsCount = _a.attribsCount;
        if (cursor < 0)
            throw "Cursor cannot be negative!";
        if (cursor >= attribsCount)
            throw "Cursor must be lesser than " + attribsCount + "!";
        var view = new DataView(this.data, cursor * 4, 4);
        view.setInt8(0, attPoint1);
        view.setInt8(1, attPoint2);
        this.cursor++;
    };
    Data.prototype.send = function () {
        var _a = this, gl = _a.gl, buff = _a.buff, data = _a.data;
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    };
    return Data;
}());
//# sourceMappingURL=shape-painter.js.map