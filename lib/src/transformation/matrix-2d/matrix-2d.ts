const M00 = 0
const M10 = 1
const M20 = 2
const M01 = 3
const M11 = 4
const M21 = 5
const M02 = 6
const M12 = 7
const M22 = 8

/**
 * Scale / Rotate / Translate in 2D.
 * Also deal with aspect ratio.
 */
export default class Matrix2D {
    public readonly matrix = new Float32Array(9)
    public x = 0
    public y = 0
    public z = 0.5
    public scale = 1
    public rotate = 0
    public cover = false

    /**
     * Compute `this.matrix`.
     * 
     * @param width Canvas width.
     * @param height Canvas height.
     */
    eval(width: number, height: number): Float32Array {
        const { matrix, x, y, scale, rotate, cover } = this
        const angle = rotate
        const C = Math.cos(angle)
        const S = Math.sin(angle)
        let sx = scale
        let sy = scale
        if (width > height) {
            // Lanscape.
            sx *= cover ? 1 : height / width
            sy *= cover ? width / height : 1
        } else {
            // Portrait.
            sx *= cover ? height / width : 1
            sy *= cover ? 1 : width / height
        }
        matrix[M00] = C * sx
        matrix[M10] = -S * sy
        matrix[M20] = 0
        matrix[M01] = S*sx
        matrix[M11] = C*sy
        matrix[M21] = 0
        matrix[M02] = x*sx
        matrix[M12] = y*sy
        matrix[M22] = 1

        return matrix
    }
}