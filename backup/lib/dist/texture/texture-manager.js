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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var texture_1 = __importDefault(require("./texture"));
var texture_video_1 = __importDefault(require("./texture-video"));
exports.default = {
    createTexture2D: createTexture2D,
    fromCamera: fromCamera,
    fromURL: fromURL,
    fromData: fromData,
    fromDataLuminance: fromDataLuminance
};
function createTexture2D(gl) {
    return new texture_1.default(gl);
}
function fromCamera(gl, minWidth, minHeight) {
    if (minWidth === void 0) { minWidth = 0; }
    if (minHeight === void 0) { minHeight = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var video, stream, tex, ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    video = document.createElement("video");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (!navigator.mediaDevices)
                        throw "Are we in a secure context?";
                    return [4 /*yield*/, navigator.mediaDevices.getUserMedia({
                            video: {
                                width: minWidth > 0 ? minWidth : 1920,
                                height: minHeight > 0 ? minHeight : 1080
                            },
                            audio: false
                        })];
                case 2:
                    stream = _a.sent();
                    tex = new texture_video_1.default(gl, video, minWidth, minHeight);
                    video.srcObject = stream;
                    video.play();
                    return [2 /*return*/, tex];
                case 3:
                    ex_1 = _a.sent();
                    console.warn("Unable to get Webcam!", ex_1);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fromData(gl, width, height, data, options) {
    if (data === void 0) { data = null; }
    var texture = gl.createTexture();
    if (!gl)
        throw "Unable to create a WebGL Texture!";
    var opt = __assign({ linear: true }, options);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_S);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.TEXTURE_WRAP_T);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, opt.linear ? gl.LINEAR : gl.NEAREST);
    return texture;
}
function fromDataLuminance(gl, width, height, data, options) {
    if (data === void 0) { data = null; }
    var texture = gl.createTexture();
    if (!gl)
        throw "Unable to create a WebGL Texture!";
    var opt = __assign({ linear: true }, options);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, width, height, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_S);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.TEXTURE_WRAP_T);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, opt.linear ? gl.LINEAR : gl.NEAREST);
    return texture;
}
function fromURL(gl, url, options) {
    var texture = gl.createTexture();
    if (!gl)
        throw "Unable to create a WebGL Texture!";
    var opt = __assign({ linear: true }, options);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Start with a transparent black pixel.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    var image = new Image();
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, opt.linear ? gl.LINEAR : gl.NEAREST);
    };
    image.src = url;
    return texture;
}
function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}
//# sourceMappingURL=texture-manager.js.map