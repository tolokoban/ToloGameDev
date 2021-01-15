import Scene from '../scene'

let globalId = 0

export default abstract class Painter<TCommonAssets = any> {
    public readonly instanceId = globalId++
    // Key: Scene ID.
    public static readonly instancesCounter = new Map<string, number>()
    public static readonly instancesCommonAssets = new Map<string, any>()

    constructor(public readonly scene: Scene) { }

    protected get key() { return `${this.scene.id}/${this.id}` }

    getCommonAsset(): TCommonAssets | undefined {
        return Painter.instancesCommonAssets
            .get(this.key) as TCommonAssets | undefined
    }

    setCommonAsset(asset: TCommonAssets) {
        Painter.instancesCommonAssets.set(this.key, asset)
    }

    countInstances(): number {
        const count = Painter.instancesCounter.get(this.key)

        return typeof count === 'number' ? count : 0
    }

    incrementInstances(): number {
        const count = this.countInstances() + 1
        Painter.instancesCounter.set(this.key, count)

        return count
    }

    decrementInstances(): number {
        const count = Math.max(0, this.countInstances() - 1)
        Painter.instancesCounter.set(this.key, count)

        return count
    }

    /**
     * Unique ID for this painter.
     */
    abstract get id(): string

    /**
     * Initialize everything that must be common to all instances
     * of this painter.
     * 
     * @returns An object regrouping all the common assets. This object
     * will be passed as argument to `initialize`.
     */
    abstract initializeCommon(): TCommonAssets

    /**
     * Initialize this instance.
     */
    abstract initialize(commonAssets: TCommonAssets): void

    abstract paint(time: number)

    /**
     * If there is some computing to do, it's better to put it here.
     * When the scene must render several painters, it performs two loops:
     *  * in the first one, it calls only the paint() method
     *  * and in the secon, it calls only the prepareNextFrame() method.
     */
    abstract prepareNextFrame(time: number)

    /**
     * Free all resources.
     */
    abstract destroy()

    /**
     * Free all resources needed for all instances.
     */
    abstract destroyCommon()
}