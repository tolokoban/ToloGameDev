import * as React from "react"
import Program from "../wasm/program/program"
import "./app.css"

export default function App() {
    return (
        <div>
            <canvas ref={onCanvasReady} width={512} height={512}></canvas>
            <br />
            <button>Start</button>
        </div>
    )
}

async function onCanvasReady(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) throw Error("Unable to creater Canvas 2D context!")

    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)

    const p = new Program({
        memory: {
            data: {
                type: "Uint8Clamped",
                cols: 4 * width,
                rows: height,
            },
        },
    })
    const cols = width * 4
    const build = await p.compile<
        [x: number, y: number, width: number, height: number, color: number]
    >(
        p.flow.module(
            p.flow.func.i32(
                {},
                p.declare.params({
                    x: "i32",
                    y: "i32",
                    width: "i32",
                    height: "i32",
                    color: "i32",
                }),
                p.set.i32(
                    "offset",
                    p.add.i32(
                        p.mul.i32(4, p.param.i32("x")),
                        p.mul.i32(p.param.i32("y"), cols)
                    )
                ),
                p.set.i32(
                    "stride",
                    p.sub.i32(cols, p.mul.i32(4, p.param.i32("width")))
                ),
                p.set.i32("loopH", p.param.i32("height")),
                p.flow.repeat(
                    "loopH",
                    p.set.i32("loopW", p.param.i32("width")),
                    p.flow.repeat(
                        "loopW",
                        p.poke.i32(p.get.i32("offset"), p.param.i32("color")),
                        p.inc.i32("offset", 4)
                    ),
                    p.inc.i32("offset", p.get.i32("stride"))
                ),
                p.get.i32("accu")
            )
        )
    )

    console.log("🚀 [app] build.sourceCode = ", build.sourceCode) // @FIXME: Remove this line written on 2022-07-07 at 15:51

    const imageData = new ImageData(
        build.memory.Uint8Clamped.data,
        width,
        height
    )

    const anim = () => {
        const x = rnd(0, width - 2)
        const y = rnd(0, height - 2)
        const w = rnd(0, width - x - 1)
        const h = rnd(0, height - y - 1)
        const R = rnd(0, 255)
        const G = rnd(0, 255)
        const B = rnd(0, 255)
        const color = 0xff000000 + R + 0x100 * G + 0x10000 * B
        build.main(x, y, w, h, color)
        if (ctx) ctx.putImageData(imageData, 0, 0)
        window.requestAnimationFrame(anim)
    }
    window.requestAnimationFrame(anim)
}

function rnd(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min))
}
