"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var program_1 = require("../program");
var texture_1 = require("../texture");
var list_1 = require("../painter/list");
var globalId = 1;
var Scene = /** @class */ (function () {
    function Scene(canvas, settings) {
        var _this = this;
        this.canvas = canvas;
        this.id = globalId++;
        this.lastWidth = 0;
        this.lastHeight = 0;
        this.program = {
            create: function (shaders) { return program_1.default.create(_this.gl, shaders); }
        };
        this.texture = {
            fromCamera: function (width, height) {
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                return texture_1.default.fromCamera(_this.gl, width, height);
            },
            fromURL: function (url, options) {
                return texture_1.default.fromURL(_this.gl, url, options);
            },
            fromData: function (width, height, data, options) { return texture_1.default.fromData(_this.gl, width, height, data, options); },
            fromDataLuminance: function (width, height, data, options) { return texture_1.default.fromDataLuminance(_this.gl, width, height, data, options); }
        };
        this.settings = __assign({ alpha: false, desynchronized: false, antialias: false, depth: true, failIfMajorPerformanceCaveat: false, powerPreference: "default", premultipliedAlpha: false, preserveDrawingBuffer: false, stencil: false }, settings);
        var gl2 = canvas.getContext("webgl2", this.settings);
        if (gl2) {
            this.gl = gl2;
            this.webglVersion = 2;
        }
        else {
            var gl = canvas.getContext("webgl", this.settings);
            if (!gl)
                throw "Impossible to create a WebGL context!";
            this.gl = gl;
            this.webglVersion = 1;
        }
        this.resize();
        this.painterList = new list_1.default(this);
    }
    Scene.prototype.getConstantName = function (value) {
        var _a;
        if (!this.constantsNames) {
            this.constantsNames = new Map();
            for (var key in this.gl) {
                var val = this.gl[key];
                if (typeof val === 'number') {
                    this.constantsNames.set(val, key);
                }
            }
        }
        var map = this.constantsNames;
        if (map.has(value)) {
            return (_a = map.get(value)) !== null && _a !== void 0 ? _a : "";
        }
        return "";
    };
    Scene.prototype.addPainter = function () {
        var e_1, _a;
        var painters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            painters[_i] = arguments[_i];
        }
        try {
            for (var painters_1 = __values(painters), painters_1_1 = painters_1.next(); !painters_1_1.done; painters_1_1 = painters_1.next()) {
                var painter_1 = painters_1_1.value;
                this.painterList.add(painter_1);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (painters_1_1 && !painters_1_1.done && (_a = painters_1.return)) _a.call(painters_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    Scene.prototype.removePainter = function () {
        var e_2, _a;
        var painters = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            painters[_i] = arguments[_i];
        }
        try {
            for (var painters_2 = __values(painters), painters_2_1 = painters_2.next(); !painters_2_1.done; painters_2_1 = painters_2.next()) {
                var painter_2 = painters_2_1.value;
                this.painterList.remove(painter_2);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (painters_2_1 && !painters_2_1.done && (_a = painters_2.return)) _a.call(painters_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    Scene.prototype.paintAll = function (time) {
        var painterList = this.painterList;
        painterList.paint(time);
        painterList.prepareNextFrame(time);
    };
    Scene.prototype.createArrayBufferStatic = function (data) {
        var gl = this.gl;
        var buff = gl.createBuffer();
        if (!buff)
            throw "Unable to create data buffer!";
        gl.bindBuffer(gl.ARRAY_BUFFER, buff);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return buff;
    };
    /**
     * Call this function at every frame render to ensure that the canvas size is reported to the WebGL scene viewport.
     */
    Scene.prototype.resize = function () {
        var _a = this, lastWidth = _a.lastWidth, lastHeight = _a.lastHeight, canvas = _a.canvas, gl = _a.gl;
        var rect = canvas.getBoundingClientRect();
        if (lastWidth !== rect.width || lastHeight !== rect.height) {
            canvas.setAttribute("width", "" + rect.width);
            canvas.setAttribute("height", "" + rect.height);
            this.lastWidth = rect.width;
            this.lastHeight = rect.height;
        }
        gl.viewport(0, 0, this.lastWidth, this.lastHeight);
    };
    Object.defineProperty(Scene.prototype, "width", {
        get: function () { return this.gl.drawingBufferWidth; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "height", {
        get: function () { return this.gl.drawingBufferHeight; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scene.prototype, "aspectRatio", {
        /**
         * Return the current aspect ratio: width / height.
         */
        get: function () {
            var gl = this.gl;
            return gl.drawingBufferWidth / gl.drawingBufferHeight;
        },
        enumerable: false,
        configurable: true
    });
    return Scene;
}());
exports.default = Scene;
//# sourceMappingURL=scene.js.map