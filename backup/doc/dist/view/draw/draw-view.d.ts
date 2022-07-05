/**
 * Use this View to draw any diagram in a consistent way.
 */
/// <reference types="react" />
import './draw-view.css';
declare type IAttach = "" | "L" | "R" | "T" | "B" | "LT" | "TL" | "LB" | "BL" | "RT" | "TR" | "RB" | "BR";
interface IOptions {
    width: number;
    height: number;
    caption?: string;
}
export default class Draw {
    private readonly options;
    private readonly commands;
    static create(options?: Partial<IOptions>): Draw;
    constructor(options: IOptions);
    render: (className?: string | undefined) => JSX.Element;
    orange(): Draw;
    blue(): Draw;
    black(): Draw;
    grey(): Draw;
    axis(): Draw;
    /**
     * @param x X center of the arc.
     * @param y Y center of the arc.
     * @param r Radius.
     * @param from Start angle (in degrees).
     * @param to End angle (in degrees).
     */
    drawArc(x: number, y: number, r: number, from?: number, to?: number): Draw;
    /**
     * @param x X center of the arc.
     * @param y Y center of the arc.
     * @param r Radius.
     * @param from Start angle (in degrees).
     * @param to End angle (in degrees).
     */
    fillArc(x: number, y: number, r: number, from?: number, to?: number): Draw;
    line(x1: number, y1: number, x2: number, y2: number): Draw;
    opacity(value: number): Draw;
    color(style: string): Draw;
    thickness(value: number): Draw;
    fillRect(x1: number, y1: number, x2: number, y2: number): Draw;
    fillTri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): Draw;
    drawTri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): Draw;
    dot(x: number, y: number, text?: string, attach?: IAttach): this;
    text(x: number, y: number, text: string, attach?: IAttach): this;
}
export interface IDrawViewProps {
    className?: string;
    width: number;
    height: number;
    onReady(ctx: CanvasRenderingContext2D): void;
}
export {};
//# sourceMappingURL=draw-view.d.ts.map