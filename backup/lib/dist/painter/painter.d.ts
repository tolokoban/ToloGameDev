import Scene from '../scene';
export default abstract class Painter<TCommonAssets = any> {
    readonly scene: Scene;
    readonly instanceId: number;
    static readonly instancesCounter: Map<string, number>;
    static readonly instancesCommonAssets: Map<string, any>;
    constructor(scene: Scene);
    protected get key(): string;
    getCommonAsset(): TCommonAssets | undefined;
    setCommonAsset(asset: TCommonAssets): void;
    countInstances(): number;
    incrementInstances(): number;
    decrementInstances(): number;
    /**
     * Unique ID for this painter.
     */
    abstract get id(): string;
    /**
     * Initialize everything that must be common to all instances
     * of this painter.
     *
     * @returns An object regrouping all the common assets. This object
     * will be passed as argument to `initialize`.
     */
    abstract initializeCommon(): TCommonAssets;
    /**
     * Initialize this instance.
     */
    abstract initialize(commonAssets: TCommonAssets): void;
    abstract paint(time: number): any;
    /**
     * If there is some computing to do, it's better to put it here.
     * When the scene must render several painters, it performs two loops:
     *  * in the first one, it calls only the paint() method
     *  * and in the secon, it calls only the prepareNextFrame() method.
     */
    abstract prepareNextFrame(time: number): any;
    /**
     * Free all resources.
     */
    abstract destroy(): any;
    /**
     * Free all resources needed for all instances.
     */
    abstract destroyCommon(): any;
}
//# sourceMappingURL=painter.d.ts.map