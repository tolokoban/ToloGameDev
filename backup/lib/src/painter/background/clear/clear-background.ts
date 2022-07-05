import Painter from '../../painter'

export default class ClearBackgroundPainter extends Painter {
    public red = 0.2
    public green = 0.1
    public blue = 0
    public alpha = 1

    get id(): string { return "ClearBackgroundPainter" }
    initializeCommon() { return undefined }
    initialize(): void { }
    paint(time: number) {
        const { red, green, blue, alpha, scene } = this
        const gl = scene.gl
        gl.clearColor(red, green, blue, alpha)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }
    prepareNextFrame(time: number) {}
    destroy() {}
    destroyCommon() {}
}