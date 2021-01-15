import Painter from '../../painter';
import Transfo2D from '../../../transformation/matrix-2d';
interface IAssets {
    prg: WebGLProgram;
}
export default class TexturePainter extends Painter<IAssets> {
    private readonly texture;
    readonly transfo: Transfo2D;
    private readonly buff;
    private prg;
    private uniTransfo;
    private uniTexture;
    private attPoint;
    private constructor();
    get id(): string;
    initializeCommon(): IAssets;
    initialize(assets: IAssets): void;
    paint(): void;
    prepareNextFrame(): void;
    destroy(): void;
    destroyCommon(): void;
}
export {};
//# sourceMappingURL=texture-background.d.ts.map