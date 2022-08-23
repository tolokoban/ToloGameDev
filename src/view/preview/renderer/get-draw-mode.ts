import { TGDPainterMode } from "@/types"

export function getDrawMode(gl: WebGL2RenderingContext, mode: TGDPainterMode) {
    switch (mode) {
        case TGDPainterMode.LINES:
            return gl.LINES
        case TGDPainterMode.LINE_LOOP:
            return gl.LINE_LOOP
        case TGDPainterMode.LINE_STRIP:
            return gl.LINE_STRIP
        case TGDPainterMode.POINTS:
            return gl.POINTS
        case TGDPainterMode.TRIANGLES:
            return gl.TRIANGLES
        case TGDPainterMode.TRIANGLE_FAN:
            return gl.TRIANGLE_FAN
        case TGDPainterMode.TRIANGLE_STRIP:
            return gl.TRIANGLE_STRIP
        default:
            throw Error(`Invalid painter mode: ${mode}!`)
    }
}
