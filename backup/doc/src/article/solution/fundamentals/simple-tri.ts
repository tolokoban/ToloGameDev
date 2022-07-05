import * as TGD from 'tolo-game-dev'
import SimpleTriVert from './simple-tri.vert'
import SimpleTriFrag from './simple-tri.frag'


export default { paint }


function paint(canvas: HTMLCanvasElement, antialias = false) {
    const scene = new TGD.Scene(canvas, { antialias })
    const prg = scene.program.create(
        {
            vert: SimpleTriVert,
            frag: SimpleTriFrag
        }
    )
    scene.createArrayBufferStatic(
        new Float32Array([
            0, 0.6,
            -.8, -.7,
            0.6, -.8
        ])
    )
    scene.gl.enableVertexAttribArray(0)
    scene.gl.vertexAttribPointer(
        0,
        2,
        scene.gl.FLOAT,
        false,
        0,
        0
    )
    scene.gl.clearColor(0, 0.4, 0.867, 1.0)
    scene.gl.clear(scene.gl.COLOR_BUFFER_BIT)
    scene.gl.drawArrays(scene.gl.TRIANGLES, 0, 3)
}