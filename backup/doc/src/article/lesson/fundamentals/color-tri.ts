import * as TGD from 'tolo-game-dev'
import ColorTriVert from './color-tri.vert'
import ColorTriFrag from './color-tri.frag'


export default { paint }


function paint(canvas: HTMLCanvasElement) {
    const scene = new TGD.Scene(canvas, { antialias: true })
    const prg = scene.program.create(
        {
            vert: ColorTriVert,
            frag: ColorTriFrag
        }
    )
    scene.createArrayBufferStatic(
        new Float32Array([
            0, 0.6, 1, 0, 0,
            -.8, -.7, 0, 1, 0,
            0.6, -.8, 1, 1, 0
        ])
    )
    const attPoint = scene.gl.getAttribLocation(prg, "attPoint")
    const attColor = scene.gl.getAttribLocation(prg, "attColor")
    scene.gl.enableVertexAttribArray(attPoint)
    scene.gl.enableVertexAttribArray(attColor)
    const BPE = Float32Array.BYTES_PER_ELEMENT
    scene.gl.vertexAttribPointer(
        attPoint,
        2,
        scene.gl.FLOAT,
        false,
        5 * BPE,
        0
    )
    scene.gl.vertexAttribPointer(
        attColor,
        3,
        scene.gl.FLOAT,
        false,
        5 * BPE,
        2 * BPE
    )
    scene.gl.clearColor(0, 0.4, 0.867, 1.0)
    scene.gl.clear(scene.gl.COLOR_BUFFER_BIT)
    scene.gl.drawArrays(scene.gl.TRIANGLES, 0, 3)
}