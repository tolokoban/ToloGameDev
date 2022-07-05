import Scene from '../../scene';
import Painter from '../painter';
import Transfo2D from '../../transformation/matrix-2d';
interface IAssets {
    prg: WebGLProgram;
}
export default class ShapePainter extends Painter<IAssets> {
    readonly color: Float32Array;
    readonly transfo: Transfo2D;
    private readonly buff;
    private prg;
    private readonly verticesCount;
    private uniZ;
    private uniColor;
    private uniTransfo;
    private constructor();
    get red(): number;
    set red(v: number);
    get blue(): number;
    set blue(v: number);
    get green(): number;
    set green(v: number);
    get alpha(): number;
    set alpha(v: number);
    get id(): string;
    initializeCommon(): IAssets;
    initialize(assets: IAssets): void;
    paint(): void;
    prepareNextFrame(): void;
    destroy(): void;
    destroyCommon(): void;
    /**
     * Create a shape from a list of pairs of numbers (x,y).
     * The result will be a fan, so the first two values are often (0,0).
     */
    static Any(scene: Scene, data: Float32Array): ShapePainter;
    static Disk(scene: Scene, radius?: number, steps?: number): ShapePainter;
    static Arrow(scene: Scene, radius?: number, angle?: number, depth?: number): ShapePainter;
}
export {};
//# sourceMappingURL=shape-painter.d.ts.map