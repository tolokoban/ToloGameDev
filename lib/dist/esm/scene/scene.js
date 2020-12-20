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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var program_1 = __importDefault(require("../program"));
var Scene = /** @class */ (function () {
    function Scene(canvas, settings) {
        var _this = this;
        this.canvas = canvas;
        this.lastWidth = 0;
        this.lastHeight = 0;
        this.program = {
            create: function (shaders) { return program_1.default.create(_this.gl, shaders); }
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
    }
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
            gl.viewport(0, 0, this.lastWidth, this.lastHeight);
        }
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