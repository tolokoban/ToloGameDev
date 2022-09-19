const X = 0
const Y = 0

export default class Resizer {
    private _width = 1
    private _height = 1
    private _ratio = 1
    private _inverseRatio = 1
    public readonly cover = new Float32Array([1, 1])
    public readonly contain = new Float32Array([1, 1])

    check(gl: WebGL2RenderingContext) {
        const { canvas } = gl
        const { width: w, height: h } = canvas.getBoundingClientRect()
        if (w === this._width && h === this._height) return

        console.log("New canvas size:", w, h)
        this._width = w
        this._height = h
        this._ratio = w / h
        this._inverseRatio = h / w
        this.cover[Y] = this._inverseRatio
        this.contain[X] = this._inverseRatio
        console.log("🚀 [resizer] this.contain, w, h = ", this.contain, w, h) // @FIXME: Remove this line written on 2022-09-12 at 10:47
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
    }
    get width() {
        return this._width
    }
    get height() {
        return this._height
    }
    get ratio() {
        return this._ratio
    }
    get inverseRatio() {
        return this._inverseRatio
    }
}
