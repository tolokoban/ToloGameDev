import { IWebGL } from '../types'
import TextureCommon from './texture-common'

export default class Texture extends TextureCommon {
    constructor(public readonly gl: IWebGL) {
        super(gl)
    }

    /**
     * Load image, video or canvas data into the texture.
     */
    loadFrame(img: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement ) {
        if (!this._alive) return

        const { gl, texture } = this
        gl.bindTexture(gl.TEXTURE_2D, texture)
        this._width = img.width
        this._height = img.height
        gl.texImage2D(
            gl.TEXTURE_2D, 0,
            gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE,
            img
        )
    }

    /**
     * Immediatly create a transparent texture of 1x1.
     * Update it as soon as the image is loaded.
     * 
     * @param url Source of the image to load.
     */
    loadImageURL(url: string) {
        if (!this._alive) return

        const { gl, texture } = this
        gl.bindTexture(gl.TEXTURE_2D, texture)
        // Start with a transparent black pixel.
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA,
            1, 1, 0,
            gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 0])
        )
        this._width = 1
        this._height = 1
        const img = new Image()
        img.src = url
        img.onload = () => {
            // Update the image as soon as it's loaded.
            this.loadFrame(img)
        }
        img.onerror = () => {
            console.warn("Unable to load image: ", url)
        }
    }
}