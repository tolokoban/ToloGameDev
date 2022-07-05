"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TextureCommon = /** @class */ (function () {
    function TextureCommon(gl) {
        var _this = this;
        this.gl = gl;
        this._alive = false;
        this._width = 0;
        this._height = 0;
        this.setHorizontalWrapClampToEdge = function () { return _this.setWrapping(true, 0); };
        this.setHorizontalWrapRepeat = function () { return _this.setWrapping(true, 1); };
        this.setHorizontalWrapRepeatMirror = function () { return _this.setWrapping(true, -1); };
        this.setVerticalWrapClampToEdge = function () { return _this.setWrapping(false, 0); };
        this.setVerticalWrapRepeat = function () { return _this.setWrapping(false, 1); };
        this.setVerticalWrapRepeatMirror = function () { return _this.setWrapping(false, -1); };
        var tex = gl.createTexture();
        if (!tex)
            throw "Unable to create a new WebGL Texture!";
        this._alive = true;
        this.texture = tex;
    }
    Object.defineProperty(TextureCommon.prototype, "isAlive", {
        get: function () { return this._alive; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextureCommon.prototype, "width", {
        get: function () { return this._width; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextureCommon.prototype, "height", {
        get: function () { return this._height; },
        enumerable: false,
        configurable: true
    });
    /**
     * Quick helper to set the wrapping behaviour.
     * Use `set(Horizontal|Vertical)Wrap*` functions for finer tuning.
     *
     * @param horizontal Should we repeat when X overflows?
     * @param vertical Should we repeat when Y overflows?
     */
    TextureCommon.prototype.wrap = function (horizontal, vertical) {
        if (!this._alive)
            return;
        var _a = this, gl = _a.gl, texture = _a.texture;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, horizontal ? gl.REPEAT : gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, vertical ? gl.REPEAT : gl.CLAMP_TO_EDGE);
    };
    TextureCommon.prototype.setWrapping = function (horizontal, wrapMode) {
        if (!this._alive)
            return;
        var _a = this, gl = _a.gl, texture = _a.texture;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, horizontal ? gl.TEXTURE_WRAP_S : gl.TEXTURE_WRAP_T, wrapMode === 0 ? gl.CLAMP_TO_EDGE : (wrapMode < 0 ? gl.MIRRORED_REPEAT : gl.REPEAT));
    };
    /**
     * Activate the texture in a slot.
     */
    TextureCommon.prototype.activate = function (slot) {
        if (slot === void 0) { slot = 0; }
        var _a = this, gl = _a.gl, texture = _a.texture;
        gl.activeTexture(gl.TEXTURE0 + slot);
        gl.bindTexture(gl.TEXTURE_2D, texture);
    };
    /**
      * Remove texture from GPU memory.
      * Once this function is called, this object is of no use.
      */
    TextureCommon.prototype.destroy = function () {
        if (!this._alive)
            return;
        var _a = this, gl = _a.gl, texture = _a.texture;
        gl.deleteTexture(texture);
        this._alive = false;
    };
    return TextureCommon;
}());
exports.default = TextureCommon;
//# sourceMappingURL=texture-common.js.map