import Painter from '../painter';
import Scene from '../../scene';
export default class ListPainter extends Painter {
    readonly scene: Scene;
    private painters;
    private paintersCounters;
    constructor(scene: Scene);
    get id(): string;
    initializeCommon(): undefined;
    initialize(): void;
    paint(time: number): void;
    prepareNextFrame(time: number): void;
    destroy(): void;
    destroyCommon(): void;
    add(painter: Painter): void;
    remove(painter: Painter): void;
    clear(): void;
}
//# sourceMappingURL=list-painter.d.ts.map