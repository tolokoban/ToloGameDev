import Painter from '../painter';
interface IAssets {
    prg: WebGLProgram;
}
export default class ShapePainter extends Painter<IAssets> {
    readonly color: Float32Array;
    x: number;
    y: number;
    z: number;
    scale: number;
    rotation: number;
    cover: boolean;
    private buff;
    private prg;
    private verticesCount;
    private uniX;
    private uniY;
    private uniZ;
    private uniColor;
    private uniScale;
    private uniScaleX;
    private uniScaleY;
    get id(): string;
    initializeCommon(): IAssets;
    initialize(assets: IAssets): void;
    paint(): void;
    prepareNextFrame(): void;
    destroy(): void;
    destroyCommon(): void;
    makeDisk(radius?: number, steps?: number): void;
    set points(data: Float32Array);
}
export {};
//# sourceMappingURL=shape-painter.d.ts.map