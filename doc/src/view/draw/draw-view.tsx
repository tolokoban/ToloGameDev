/**
 * Use this View to draw any diagram in a consistent way.
 */

// tslint:disable: no-magic-numbers
import * as React from "react"
import { ContextReplacementPlugin } from "webpack"
import './draw-view.css'

const ORANGE = "#f90"
const BLUE = "#28f"

type ICommand = (ctx: CanvasRenderingContext2D, width: number, height: number) => void
type IAttach =
    | ""
    | "L"
    | "R"
    | "T"
    | "B"
    | "LT" | "TL"
    | "LB" | "BL"
    | "RT" | "TR"
    | "RB" | "BR"
const MARGIN = 40

interface IOptions {
    width: number
    height: number
    caption?: string
}

export default class Draw {
    private readonly commands: ICommand[] = []

    static create(options: Partial<IOptions> = {}) {
        return new Draw({
            width: 300,
            height: 300,
            ...options
        })
    }

    constructor(private readonly options: IOptions) { }

    render = (className?: string) => {
        const { width, height, caption } = this.options

        return <figure>
            <DrawView
                width={width}
                height={height}
                className={`view-DrawView ${typeof className === "string" ? className : ""}`}
                onReady={ctx => {
                    const { canvas } = ctx
                    const w = canvas.clientWidth
                    const h = canvas.clientHeight
                    canvas.setAttribute("width", `${w}`)
                    canvas.setAttribute("height", `${h}`)
                    ctx.clearRect(0, 0, w, h)
                    ctx.font = "11px sans-serif"
                    ctx.lineCap = "round"
                    ctx.lineJoin = "round"
                    ctx.fillStyle = "#000"
                    ctx.strokeStyle = "#000"
                    for (const cmd of this.commands) {
                        cmd(ctx, w, h)
                    }
                }}
            />
            {
                caption &&
                <div>{caption}</div>
            }
        </figure>
    }

    orange() { return this.color(ORANGE) }
    blue() { return this.color(BLUE) }
    black() { return this.color("#000") }
    grey() { return this.color("#bbb") }

    axis(): Draw {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                const X = convX(w, h)
                const Y = convY(w, h)
                const W = convW(w, h)
                const H = convH(w, h)
                ctx.save()
                ctx.lineWidth = 1
                ctx.fillStyle = "#bbb"
                ctx.fillRect(X(-1), Y(+1), W(2), H(2))
                ctx.strokeStyle = "#777"
                ctx.beginPath()
                ctx.moveTo(X(-2), Y(0))
                ctx.lineTo(X(+2), Y(0))
                ctx.moveTo(X(0), Y(-2))
                ctx.lineTo(X(0), Y(+2))
                ctx.stroke()
                ctx.restore()
            }
        )

        return this
    }

    /**
     * @param x X center of the arc.
     * @param y Y center of the arc.
     * @param r Radius.
     * @param from Start angle (in degrees).
     * @param to End angle (in degrees).
     */
    drawArc(x: number, y: number, r: number, from = 0, to = 360): Draw {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                const X = convX(w, h)
                const Y = convY(w, h)
                const W = convW(w, h)
                const DEG2RAD = 0.017453292519943295
                ctx.beginPath()
                ctx.ellipse(
                    X(x), Y(y),
                    W(r), W(r), 0,
                    -from * DEG2RAD,
                    -to * DEG2RAD,
                    true
                )
                ctx.stroke()
            }
        )

        return this
    }

    /**
     * @param x X center of the arc.
     * @param y Y center of the arc.
     * @param r Radius.
     * @param from Start angle (in degrees).
     * @param to End angle (in degrees).
     */
    fillArc(x: number, y: number, r: number, from = 0, to = 360): Draw {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                const X = convX(w, h)
                const Y = convY(w, h)
                const W = convW(w, h)
                const DEG2RAD = 0.017453292519943295
                ctx.beginPath()
                ctx.ellipse(
                    X(x), Y(y),
                    W(r), W(r), 0,
                    from * DEG2RAD,
                    to * DEG2RAD
                )
                ctx.fill()
            }
        )

        return this
    }

    line(x1: number, y1: number, x2: number, y2: number): Draw {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                const X = convX(w, h)
                const Y = convY(w, h)
                ctx.beginPath()
                ctx.moveTo(X(x1), Y(y1))
                ctx.lineTo(X(x2), Y(y2))
                ctx.stroke()
            }
        )

        return this
    }

    opacity(value: number): Draw {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                ctx.globalAlpha = value
            }
        )

        return this
    }

    color(style: string): Draw {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                ctx.fillStyle = style
                ctx.strokeStyle = style
            }
        )

        return this
    }

    thickness(value: number): Draw {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                ctx.lineWidth = value
            }
        )

        return this
    }

    fillRect(x1: number, y1: number, x2: number, y2: number): Draw {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                const X = convX(w, h)
                const Y = convY(w, h)
                const W = convW(w, h)
                const H = convH(w, h)
                const xx = Math.min(X(x1), X(x2))
                const yy = Math.min(Y(y1), Y(y2))
                const ww = W(Math.abs(x1 - x2))
                const hh = H(Math.abs(y1 - y2))
                ctx.fillRect(xx, yy, ww, hh)
            }
        )

        return this
    }

    fillTri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): Draw {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                const X = convX(w, h)
                const Y = convY(w, h)
                ctx.beginPath()
                ctx.moveTo(X(x1), Y(y1))
                ctx.lineTo(X(x2), Y(y2))
                ctx.lineTo(X(x3), Y(y3))
                ctx.closePath()
                ctx.fill()
            }
        )

        return this
    }

    drawTri(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): Draw {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                const X = convX(w, h)
                const Y = convY(w, h)
                ctx.beginPath()
                ctx.moveTo(X(x1), Y(y1))
                ctx.lineTo(X(x2), Y(y2))
                ctx.lineTo(X(x3), Y(y3))
                ctx.closePath()
                ctx.stroke()
            }
        )

        return this
    }

    dot(x: number, y: number, text: string = "", attach: IAttach = "") {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                const X = convX(w, h)
                const Y = convY(w, h)
                ctx.beginPath()
                ctx.arc(X(x), Y(y), 3, 0, 2 * Math.PI, true)
                ctx.fill()
            }
        )

        if (text.trim().length === 0) return this

        return this.text(x, y, text, getBestAttach(attach, x, y))
    }

    text(x: number, y: number, text: string, attach: IAttach = "") {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                const X = convX(w, h)
                const Y = convY(w, h)
                let xx = X(x)
                let yy = Y(y)
                if (attach.indexOf("L") !== -1) {
                    ctx.textAlign = "start"
                    xx += 4
                }
                else if (attach.indexOf("R") !== -1) {
                    ctx.textAlign = "end"
                    xx -= 4
                }
                else ctx.textAlign = "center"
                if (attach.indexOf("T") !== -1) {
                    ctx.textBaseline = "top"
                    yy += 4
                }
                else if (attach.indexOf("B") !== -1) {
                    ctx.textBaseline = "bottom"
                    yy -= 4
                }
                else ctx.textBaseline = "middle"
                ctx.fillText(text, xx, yy)
            }
        )

        return this
    }

}


function factor(width: number, height: number) {
    return Math.max(MARGIN, Math.min(width, height) - MARGIN) / 2
}

function convX(w: number, h: number) {
    return (x: number) => Math.floor(w * 0.5 + x * factor(w, h) + 0.5) + 0.5
}

function convY(w: number, h: number) {
    return (y: number) => Math.floor(h * 0.5 - y * factor(w, h) + 0.5) + 0.5
}

function convW(width: number, height: number) {
    return (w: number) => Math.abs(w) * factor(width, height)
}

function convH(width: number, height: number) {
    return (h: number) => Math.abs(h) * factor(width, height)
}

function getBestAttach(attach: IAttach, x: number, y: number): IAttach {
    if (attach !== "") return attach

    if (x < 0) {
        if (y < 0) return "RT"
        return "RB"
    }
    if (y < 0) return "LT"
    return "LB"
}


export interface IDrawViewProps {
    className?: string
    width: number
    height: number
    onReady(ctx: CanvasRenderingContext2D): void
}

class DrawView extends React.Component<IDrawViewProps> {
    private readonly ref = React.createRef<HTMLCanvasElement>()

    componentDidMount() {
        const canvas = this.ref.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        this.fire()
        this.observer.observe(canvas)
    }

    componentWillUnmount() {
        const canvas = this.ref.current
        if (!canvas) return

        this.observer.unobserve(canvas)
        this.observer.disconnect()
    }

    fire = () => {
        const canvas = this.ref.current
        console.log("[draw-view] canvas = ", canvas) // @FIXME: Remove this line written on 2020-12-21 at 09:07
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        this.props.onReady(ctx)
    }

    private readonly observer = new ResizeObserver(this.fire)

    render() {
        const classNames = ['custom', 'view-DrawView']
        const { width, height, className } = this.props
        if (typeof className === 'string') {
            classNames.push(className)
        }

        return <canvas
            ref={this.ref}
            width={width}
            height={height}
            className={classNames.join(" ")}
        >
        </canvas>
    }
}
