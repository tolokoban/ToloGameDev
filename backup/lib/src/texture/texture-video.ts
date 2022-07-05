import { IWebGL } from '../types'
import TextureCommon from './texture-common'

export default class Texture extends TextureCommon {
    protected _isPlaying = false

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
    constructor(
        public readonly gl: IWebGL,
        public readonly video: HTMLVideoElement,
        minWidth: number = 0,
        minHeight: number = 0
    ) {
        super(gl)
        video.addEventListener("canplay", () => {
            if (this._isPlaying) return

            this._isPlaying = true
            if (minWidth > 0 && minHeight > 0) {
                const requestedAspectRatio = minWidth / minHeight
                const actualAspectRatio = video.videoWidth / video.videoHeight
                if (requestedAspectRatio > actualAspectRatio) {
                    this._width = minWidth
                    this._height = minWidth / actualAspectRatio
                } else {
                    this._height = minHeight
                    this._width = minHeight * actualAspectRatio
                }
            } else {
                // No minWidth/minHeight specified, we keep actual video size.
                this._width = video.videoWidth
                this._height = video.videoHeight
            }
            video.setAttribute("width", `${this._width}`)
            video.setAttribute("height", `${this._height}`)
            this.update()
        }, false)
    }

    update() {
        if (!this._alive || !this._isPlaying) return

        const { gl, texture, video } = this
        gl.bindTexture(gl.TEXTURE_2D, texture)
        this._width = video.width
        this._height = video.height
        gl.texImage2D(
            gl.TEXTURE_2D, 0,
            gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            video
        )
    }
}
