import AbstractSceneView from '../../view/abstract-scene'
import * as TGD from 'tolo-game-dev'

import Landscape from './landscape.webp'

import "./whirl-camera-view.css"


export default class WhirlCameraView extends AbstractSceneView {
    //private texCamera: TGD.TextureVideo
    private shapeOut: TGD.ShapePainter
    private shapeIn: TGD.ShapePainter

    async initialize(scene: TGD.Scene): Promise<boolean> {
        // const tex = await scene.texture.fromCamera(
        //     640, 480
        // )
        const tex = await scene.texture.fromURL(Landscape)
        if (!tex) {
            console.error("Unable to get Camera!")
            return false
        }        

        const clear = new TGD.TextureBackgroundPainter(scene, tex)
        const shapeIn = TGD.ShapePainter.Disk(scene, 1, 9)
        const arrow = TGD.ShapePainter.Arrow(scene, 1)
        arrow.red = 0
        arrow.green = 0.5
        arrow.blue = 1
        scene.addPainter(clear, shapeIn, arrow)
        this.shapeIn = shapeIn

        return true
    }

    anim(scene: TGD.Scene, time: number) {
        scene.paintAll(time)
        this.shapeIn.transfo.rotate = -0.00075123 * time
    }

    get className() {
        return "view-WhirlCamera"
    }
}
