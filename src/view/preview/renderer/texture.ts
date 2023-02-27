import ImageURL from "@/gfx/test.webp"
// import ImageURL from "@/gfx/depth-map.jpg"

export default class Texture {
    public readonly texture: WebGLTexture

    constructor(
        private readonly gl: WebGL2RenderingContext,
        public readonly location: WebGLUniformLocation
    ) {
        const texture = gl.createTexture()
        if (!texture) throw Error("Unable to create a WebGLTexture!")

        this.texture = texture
        gl.bindTexture(gl.TEXTURE_2D, texture)

        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            1,
            1,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 255, 255])
        )
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        // Asynchronously load an image
        var image = new Image()
        image.src = ImageURL
        image.addEventListener("load", function () {
            gl.bindTexture(gl.TEXTURE_2D, texture)
            gl.texImage2D(
                gl.TEXTURE_2D,
                0,
                gl.RGBA,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                image
            )
            gl.generateMipmap(gl.TEXTURE_2D)
        })
    }
}
