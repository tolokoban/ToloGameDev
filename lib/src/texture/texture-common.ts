import { IWebGL } from '../types'

export default class TextureCommon {
    public readonly texture: WebGLTexture
    protected _alive = false
    protected _width = 0
    protected _height = 0

    constructor(public readonly gl: IWebGL) {
        const tex = gl.createTexture()
        if (!tex) throw "Unable to create a new WebGL Texture!"

        this._alive = true
        this.texture = tex
    }

    get isAlive() { return this._alive }
    get width() { return this._width }
    get height() { return this._height }

    /**
     * Quick helper to set the wrapping behaviour.
     * Use `set(Horizontal|Vertical)Wrap*` functions for finer tuning.
     * 
     * @param horizontal Should we repeat when X overflows?
     * @param vertical Should we repeat when Y overflows?
     */
    wrap(horizontal: boolean, vertical: boolean) {
        if (!this._alive) return

        const { gl, texture } = this
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_WRAP_S,
            horizontal ? gl.REPEAT : gl.CLAMP_TO_EDGE
        )
        gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_WRAP_T,
            vertical ? gl.REPEAT : gl.CLAMP_TO_EDGE
        )
    }

    private setWrapping(horizontal: boolean, wrapMode: -1 | 0 | 1) {
        if (!this._alive) return

        const { gl, texture } = this
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texParameteri(
            gl.TEXTURE_2D,
            horizontal ? gl.TEXTURE_WRAP_S : gl.TEXTURE_WRAP_T,
            wrapMode === 0 ? gl.CLAMP_TO_EDGE : (
                wrapMode < 0 ? gl.MIRRORED_REPEAT : gl.REPEAT
            )
        )
    }

    setHorizontalWrapClampToEdge = () => this.setWrapping(true, 0)
    setHorizontalWrapRepeat = () => this.setWrapping(true, 1)
    setHorizontalWrapRepeatMirror = () => this.setWrapping(true, -1)
    setVerticalWrapClampToEdge = () => this.setWrapping(false, 0)
    setVerticalWrapRepeat = () => this.setWrapping(false, 1)
    setVerticalWrapRepeatMirror = () => this.setWrapping(false, -1)
    
   /**
     * Remove texture from GPU memory.
     * Once this function is called, this object is of no use.
     */
    destroy() {
        if (!this._alive) return

        const { gl, texture } = this
        gl.deleteTexture(texture)
        this._alive = false
    }
}