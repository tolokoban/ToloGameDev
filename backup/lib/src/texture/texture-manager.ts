import Texture from "./texture"
import TextureVideo from "./texture-video"
import { ITextureOptions, IWebGL } from "../types"

export default {
    createTexture2D,
    fromCamera,
    fromURL,
    fromData,
    fromDataLuminance,
}

function createTexture2D(gl: IWebGL): Texture {
    return new Texture(gl)
}

async function fromCamera(
    gl: IWebGL,
    minWidth: number = 0,
    minHeight: number = 0
): Promise<TextureVideo | null> {
    const video = document.createElement("video")
    try {
        if (!navigator.mediaDevices) throw "Are we in a secure context?"

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: minWidth > 0 ? minWidth : 1920,
                height: minHeight > 0 ? minHeight : 1080,
            },
            audio: false,
        })
        const tex = new TextureVideo(gl, video, minWidth, minHeight)
        video.srcObject = stream
        video.play()

        return tex
    } catch (ex) {
        console.warn("Unable to get Webcam!", ex)
        return null
    }
}

function fromData(
    gl: IWebGL,
    width: number,
    height: number,
    data: Uint8Array | null = null,
    options?: Partial<ITextureOptions>
): WebGLTexture {
    const texture = gl.createTexture()
    if (!texture) throw "Unable to create a WebGL Texture!"

    const opt: ITextureOptions = {
        linear: true,
        ...options,
    }
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        data
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_S)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.TEXTURE_WRAP_T)
    gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        opt.linear ? gl.LINEAR : gl.NEAREST
    )

    return texture as WebGLTexture
}

function fromDataLuminance(
    gl: IWebGL,
    width: number,
    height: number,
    data: Uint8Array | null = null,
    options?: Partial<ITextureOptions>
): WebGLTexture {
    const texture = gl.createTexture()
    if (!gl) throw "Unable to create a WebGL Texture!"

    const opt: ITextureOptions = {
        linear: true,
        ...options,
    }
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.LUMINANCE,
        width,
        height,
        0,
        gl.LUMINANCE,
        gl.UNSIGNED_BYTE,
        data
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_S)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.TEXTURE_WRAP_T)
    gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        opt.linear ? gl.LINEAR : gl.NEAREST
    )

    return texture as WebGLTexture
}

function fromURL(
    gl: IWebGL,
    url: string,
    options?: Partial<ITextureOptions>
): WebGLTexture {
    const texture = gl.createTexture()
    if (!gl) throw "Unable to create a WebGL Texture!"

    const opt: ITextureOptions = {
        linear: true,
        ...options,
    }
    const w = gl.drawingBufferWidth
    gl.bindTexture(gl.TEXTURE_2D, texture)
    // Start with a transparent black pixel.
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 0])
    )

    const image = new Image()
    image.onload = function () {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
        )

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D)
        } else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        }
        gl.texParameteri(
            gl.TEXTURE_2D,
            gl.TEXTURE_MIN_FILTER,
            opt.linear ? gl.LINEAR : gl.NEAREST
        )
    }
    image.src = url

    return texture as WebGLTexture
}

function isPowerOf2(value: number): boolean {
    return (value & (value - 1)) == 0
}
