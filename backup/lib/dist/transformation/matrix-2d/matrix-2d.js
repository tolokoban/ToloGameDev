"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var M00 = 0;
var M10 = 1;
var M20 = 2;
var M01 = 3;
var M11 = 4;
var M21 = 5;
var M02 = 6;
var M12 = 7;
var M22 = 8;
/**
 * Scale / Rotate / Translate in 2D.
 * Also deal with aspect ratio.
 */
var Matrix2D = /** @class */ (function () {
    function Matrix2D() {
        this.matrix = new Float32Array(9);
        this.x = 0;
        this.y = 0;
        this.z = 0.5;
        this.scale = 1;
        this.rotate = 0;
        this.cover = false;
    }
    /**
     * Compute `this.matrix`.
     *
     * @param width Canvas width.
     * @param height Canvas height.
     */
    Matrix2D.prototype.eval = function (width, height) {
        var _a = this, matrix = _a.matrix, x = _a.x, y = _a.y, scale = _a.scale, rotate = _a.rotate, cover = _a.cover;
        var angle = rotate;
        var C = Math.cos(angle);
        var S = Math.sin(angle);
        var sx = scale;
        var sy = scale;
        if (width > height) {
            // Lanscape.
            sx *= cover ? 1 : height / width;
            sy *= cover ? width / height : 1;
        }
        else {
            // Portrait.
            sx *= cover ? height / width : 1;
            sy *= cover ? 1 : width / height;
        }
        matrix[M00] = C * sx;
        matrix[M10] = -S * sy;
        matrix[M20] = 0;
        matrix[M01] = S * sx;
        matrix[M11] = C * sy;
        matrix[M21] = 0;
        matrix[M02] = x * sx;
        matrix[M12] = y * sy;
        matrix[M22] = 1;
        return matrix;
    };
    return Matrix2D;
}());
exports.default = Matrix2D;
//# sourceMappingURL=matrix-2d.js.map