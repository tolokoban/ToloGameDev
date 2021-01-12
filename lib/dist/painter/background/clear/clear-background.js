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
var ClearBackgroundPainter = /** @class */ (function (_super) {
    __extends(ClearBackgroundPainter, _super);
    function ClearBackgroundPainter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.red = 0.2;
        _this.green = 0.1;
        _this.blue = 0;
        _this.alpha = 1;
        return _this;
    }
    Object.defineProperty(ClearBackgroundPainter.prototype, "id", {
        get: function () { return "ClearBackgroundPainter"; },
        enumerable: false,
        configurable: true
    });
    ClearBackgroundPainter.prototype.initializeCommon = function () { return undefined; };
    ClearBackgroundPainter.prototype.initialize = function () { };
    ClearBackgroundPainter.prototype.paint = function (time) {
        var _a = this, red = _a.red, green = _a.green, blue = _a.blue, alpha = _a.alpha, scene = _a.scene;
        var gl = scene.gl;
        gl.clearColor(red, green, blue, alpha);
        gl.clear(gl.COLOR_BUFFER_BIT);
    };
    ClearBackgroundPainter.prototype.prepareNextFrame = function (time) { };
    ClearBackgroundPainter.prototype.destroy = function () { };
    ClearBackgroundPainter.prototype.destroyCommon = function () { };
    return ClearBackgroundPainter;
}(painter_1.default));
exports.default = ClearBackgroundPainter;
//# sourceMappingURL=clear-background.js.map