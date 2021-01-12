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
var texture_common_1 = require("./texture-common");
var Texture = /** @class */ (function (_super) {
    __extends(Texture, _super);
    /**
     * `minWidth` and `minHeight` can have a different aspect ratio than
     * the actual video. We must keep the aspect ratio of the video,
     * so we will use a "cover" algorithm.
     * For instance, if the actual video is `1000x500` but we requested
     * `minWidth=400` and `minHeight=400`, we will resize the video to
     * `800x400`.
     *
     * @param gl WebGL or WebGL2 context
     * @param video Video element
     * @param minWidth Minimal width (video will be resized according to aspect ratio)
     * @param minHeight Same for height.
     */
    function Texture(gl, video, minWidth, minHeight) {
        if (minWidth === void 0) { minWidth = 0; }
        if (minHeight === void 0) { minHeight = 0; }
        var _this = _super.call(this, gl) || this;
        _this.gl = gl;
        _this.video = video;
        _this._isPlaying = false;
        video.addEventListener("canplay", function () {
            if (_this._isPlaying)
                return;
            _this._isPlaying = true;
            if (minWidth > 0 && minHeight > 0) {
                var requestedAspectRatio = minWidth / minHeight;
                var actualAspectRatio = video.videoWidth / video.videoHeight;
                if (requestedAspectRatio > actualAspectRatio) {
                    _this._width = minWidth;
                    _this._height = minWidth / actualAspectRatio;
                }
                else {
                    _this._height = minHeight;
                    _this._width = minHeight * actualAspectRatio;
                }
            }
            else {
                // No minWidth/minHeight specified, we keep actual video size.
                _this._width = video.videoWidth;
                _this._height = video.videoHeight;
            }
            video.setAttribute("width", "" + _this._width);
            video.setAttribute("height", "" + _this._height);
            _this.update();
        }, false);
        return _this;
    }
    Texture.prototype.update = function () {
        if (!this._alive || !this._isPlaying)
            return;
        var _a = this, gl = _a.gl, texture = _a.texture, video = _a.video;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        this._width = video.width;
        this._height = video.height;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    };
    return Texture;
}(texture_common_1.default));
exports.default = Texture;
//# sourceMappingURL=texture-video.js.map