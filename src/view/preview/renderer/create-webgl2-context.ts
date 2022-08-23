export function createWebGL2Context(
    canvas: HTMLCanvasElement
): WebGL2RenderingContext {
    const gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        failIfMajorPerformanceCaveat: true,
        stencil: false,
        depth: false,
        premultipliedAlpha: false,
    })
    if (!gl) throw Error("Unable to create a WebGL2 context!")

    return gl
}
