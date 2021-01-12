import Painter from '../painter'
import Scene from '../../scene'

export default class ListPainter extends Painter {
    private painters: Painter[] = []
    // Count the number of instances of each Painter.
    // It's useful to know when to initialize/destroy common assets.
    private paintersCounters = new Map<string, number>()

    constructor(public readonly scene: Scene) {
        super(scene)
    }

    get id(): string { return "ListPainter" }

    initializeCommon() { return undefined }

    initialize() { }

    paint(time: number) {
        for (const painter of this.painters) {
            painter.paint(time)
        }
    }

    prepareNextFrame(time: number) {
        for (const painter of this.painters) {
            painter.prepareNextFrame(time)
        }
    }

    destroy() {
        this.clear()
    }
    destroyCommon() { }

    add(painter: Painter) {
        if (painter.incrementInstances() === 1) {
            // First instance, we need to initialize common assets.
            const assets = painter.initializeCommon()
            console.log(`[${painter.id}] new assets = `, assets) // @FIXME: Remove this line written on 2021-01-12 at 22:20
            painter.setCommonAsset(assets)
            painter.initialize(assets)
        } else {
            const assets = painter.getCommonAsset()
            console.log(`[${painter.id}] assets from cache = `, assets) // @FIXME: Remove this line written on 2021-01-12 at 22:20
            painter.initialize(assets)
        }
        this.painters.push(painter)
    }

    remove(painter: Painter) {
        const { painters } = this
        for (let i = 0; i < painters.length; i++) {
            const p = painters[i]
            if (p === painter) {
                p.destroy()
                if (p.decrementInstances() === 0) {
                    p.destroyCommon()
                }
                painters.splice(i, 1)
                return
            }
        }
    }

    clear() {
        for (const painter of this.painters) {
            painter.destroy()
            if (painter.decrementInstances() === 0) {
                painter.destroyCommon()
            }
        }

        this.painters.splice(0, this.painters.length)
    }
}