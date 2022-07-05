/**
 * Scale / Rotate / Translate in 2D.
 * Also deal with aspect ratio.
 */
export default class Matrix2D {
    readonly matrix: Float32Array;
    x: number;
    y: number;
    z: number;
    scale: number;
    rotate: number;
    cover: boolean;
    /**
     * Compute `this.matrix`.
     *
     * @param width Canvas width.
     * @param height Canvas height.
     */
    eval(width: number, height: number): Float32Array;
}
//# sourceMappingURL=matrix-2d.d.ts.map