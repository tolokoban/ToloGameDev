import Painter from '../../painter';
export default class ClearBackgroundPainter extends Painter {
    red: number;
    green: number;
    blue: number;
    alpha: number;
    get id(): string;
    initializeCommon(): undefined;
    initialize(): void;
    paint(time: number): void;
    prepareNextFrame(time: number): void;
    destroy(): void;
    destroyCommon(): void;
}
//# sourceMappingURL=clear-background.d.ts.map