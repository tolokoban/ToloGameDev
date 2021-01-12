import AbstractSceneView from '../../view/abstract-scene'
import * as TGD from 'tolo-game-dev'
import { timingSafeEqual } from 'crypto'

export default class WhirlCameraView extends AbstractSceneView {
    //private texCamera: TGD.TextureVideo

    async initialize(scene: TGD.Scene): Promise<boolean> {
        // const tex = await scene.texture.fromCamera(
        //     256, 512
        // )
        // if (!tex) {
        //     console.error("Unable to get Camera!")
        //     return false
        // }

        // this.texCamera = tex
        const clear = new TGD.ClearBackgroundPainter(scene)
        scene.addPainter(clear)
        const shape = new TGD.ShapePainter(scene)
        scene.addPainter(shape)
        shape.makeDisk(0.9)
        return true
    }

    anim(scene: TGD.Scene, time: number) {
        scene.paintAll(time)
    }

}
