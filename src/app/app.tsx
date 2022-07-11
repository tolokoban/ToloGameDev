import * as React from "react"
import Program from "../wasm/program/program"
import { Instruction } from "../wasm/types"
import "./app.css"

export default function App() {
    return (
        <div>
            <canvas ref={onCanvasReady} width={1024} height={1024}></canvas>
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
            pos: {
                type: "Float32",
                data: new Float32Array([0, 0]),
            },
            rnd: {
                type: "Uint8Clamped",
                data: makeRandomUint8(0x1000),
            },
        },
    })

    const cols = width * 4
    const build = await p.compile<
        [x: number, y: number, width: number, height: number, color: number]
    >(
        p.flow.module(
            p.flow.func.void(
                { name: "plot" },
                p.declare.params({
                    x: "f32",
                    y: "f32",
                }),
                p.set.i32("X", `(2.1821 + $x) * ${(width - 1) / 4.8379}`),
                p.set.i32("Y", `$y + ${(height - 1) / 9.9984}`),
                p.set.i32("offset", `(4 * $X) + (${cols} * $Y)`),
                p.poke.i32For8(
                    p.get.i32("offset"),
                    p.add.i32(1, p.peek.i32For8u(p.get.i32("offset")))
                )
            ),
            makeFunc(p, "f1", 0, 0, 0, 0.25, 0, -0.4),
            makeFunc(p, "f2", 0.85, 0.04, -0.04, 0.85, 0, 1.6),
            makeFunc(p, "f3", 0.2, -0.26, 0.23, 0.22, 0, 1.6),
            makeFunc(p, "f4", -0.15, 0.28, 0.26, 0.24, 0, 0.44),
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

function makeFunc(
    p: Program,
    name: string,
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
): Instruction<"func"> {
    return p.flow.func.void(
        { name },
        p.set.f32("x", p.peek.f32("@pos")),
        p.set.f32("y", p.peek.f32("@pos+1")),
        p.poke.f32(p.$memory.get("pos").offset, `${a}*x + ${b}*y + ${c}`),
        p.poke.f32(
            p.add.i32(1, p.$memory.get("pos").offset),
            `${d}*x + ${e}*y + ${f}`
        )
    )
}

function makeRandomUint8(count: number): Uint8ClampedArray {
    const data: number[] = []
    for (let i = 0; i < count; i++) {
        data.push(rnd(0, 255))
    }
    return new Uint8ClampedArray(data)
}
