/**
 * Use this View to draw any diagram in a consistent way.
 */

// tslint:disable: no-magic-numbers
import * as React from "react"

import './draw-view.css'


type ICommand = (ctx: CanvasRenderingContext2D, width: number, height: number) => void

export default class Draw {
    private readonly commands: ICommand[] = []

    static create() { return new Draw() }

    render = (className?: string) => <figure>
        <DrawView
            className={`view-DrawView ${typeof className === "string" ? className : ""}`}
            onReady={ctx => {
                console.log("[draw-view] ctx = ", ctx) // @FIXME: Remove this line written on 2020-12-20 at 20:56
                const w = ctx.canvas.clientWidth
                const h = ctx.canvas.clientHeight
                ctx.clearRect(0, 0, w, h)
                ctx.font = "12px sans-serif"
                for (const cmd of this.commands) {
                    console.log("[draw-view] cmd, w, h = ", cmd, w, h) // @FIXME: Remove this line written on 2020-12-20 at 20:56
                    cmd(ctx, w, h)
                }
            }}
        />
    </figure>

    axis(): Draw {
        this.commands.push(
            (ctx: CanvasRenderingContext2D, w: number, h: number) => {
                const X = convX(w, h)
                const Y = convY(w, h)
                const W = convW(w, h)
                const H = convH(w, h)
                ctx.fillStyle = "#ccc"
                ctx.fillRect(X(-1), Y(-1), W(2), H(2))
                console.log("[draw-view] X(-1), Y(-1), W(2), H(2) = ", X(-1), Y(-1), W(2), H(2)) // @FIXME: Remove this line written on 2020-12-20 at 20:57
                ctx.strokeStyle = "#555"
                ctx.beginPath()
                ctx.moveTo(X(-2), Y(0))
                ctx.lineTo(X(+2), Y(0))
                ctx.moveTo(X(0), Y(-2))
                ctx.lineTo(X(0), Y(+2))
                ctx.stroke()
            }
        )

        return this
    }
}


function convX(width: number, height: number) {
    const xC = width * 0.5
    const factor = Math.max(20, Math.min(width, height) - 20) / 2

    return (x: number) => 0.5 + Math.floor(xC + x * factor + 0.5)
}

function convY(width: number, height: number) {
    const yC = height * 0.5
    const factor = Math.max(20, Math.min(width, height) - 20) / 2

    return (y: number) => 0.5 + Math.floor(yC + y * factor + 0.5)
}

function convW(width: number, height: number) {
    const factor = Math.max(20, Math.min(width, height) - 20) / 2

    return (w: number) => w * factor
}

function convH(width: number, height: number) {
    const factor = Math.max(20, Math.min(width, height) - 20) / 2

    return (h: number) => h * factor
}



export interface IDrawViewProps {
    className?: string
    onReady(ctx: CanvasRenderingContext2D): void
}

class DrawView extends React.Component<IDrawViewProps> {
    private ref = React.createRef<HTMLCanvasElement>()

    componentDidMount() {
        const canvas = this.ref.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        this.props.onReady(ctx)
    }

    render() {
        const classNames = ['custom', 'view-DrawView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <canvas
            ref={this.ref}
            className={classNames.join(" ")}
        >
        </canvas>
    }
}
