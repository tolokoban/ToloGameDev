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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var texture_common_1 = __importDefault(require("./texture-common"));
var Texture = /** @class */ (function (_super) {
    __extends(Texture, _super);
    function Texture(gl) {
        var _this = _super.call(this, gl) || this;
        _this.gl = gl;
        return _this;
    }
    /**
     * Load image, video or canvas data into the texture.
     */
    Texture.prototype.loadFrame = function (img) {
        if (!this._alive)
            return;
        var _a = this, gl = _a.gl, texture = _a.texture;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        this._width = img.width;
        this._height = img.height;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    };
    /**
     * Immediatly create a transparent texture of 1x1.
     * Update it as soon as the image is loaded.
     *
     * @param url Source of the image to load.
     */
    Texture.prototype.loadImageURL = function (url) {
        var _this = this;
        if (!this._alive)
            return;
        var _a = this, gl = _a.gl, texture = _a.texture;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Start with a transparent black pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
        this._width = 1;
        this._height = 1;
        var img = new Image();
        img.src = url;
        img.onload = function () {
            // Update the image as soon as it's loaded.
            _this.loadFrame(img);
        };
        img.onerror = function () {
            console.warn("Unable to load image: ", url);
        };
    };
    return Texture;
}(texture_common_1.default));
exports.default = Texture;
//# sourceMappingURL=texture.js.map