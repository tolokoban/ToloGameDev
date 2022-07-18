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
            index: {
                type: "Uint32",
                data: new Uint32Array([0, 1]),
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
                p.log.text("plot()"),
                p.set.i32("X", `(2.1821 + $x) * ${(width - 1) / 4.8379}`),
                p.set.i32("Y", `$y + ${(height - 1) / 9.9984}`),
                p.if.void("($X > 0) & ($Y > 0) & ($X < 1024) & ($Y < 1024)", [
                    p.set.i32("offset", `(4 * $X) + (${cols} * $Y)`),
                    p.log.local("X"),
                    p.log.local("Y"),
                    p.poke.i32For8(
                        p.get.i32("offset"),
                        p.add.i32(1, p.peek.i32For8u(p.get.i32("offset")))
                    ),
                ])
            ),
            p.flow.func.void(
                {},
                p.declare.params({
                    loops: "i32",
                }),
                p.set.i32("loop", "$loops"),
                p.set.f32("x", p.peek.f32("@pos")),
                p.set.f32("y", p.peek.f32("@pos+1")),
                p.set.i32("idx1", p.peek.i32("@index")),
                p.set.i32("idx2", p.peek.i32("@index+1")),
                p.flow.repeat(
                    "loop",
                    p.set.i32("idx1", "($idx1 * 3) & 0xfff"),
                    p.set.i32("idx2", "($idx2 * 7) & 0xfff"),
                    p.set.i32("rnd", "[@rnd + $idx1] ^ [@rnd + $idx2]"),
                    p.if.void(
                        p.is.lesser.ui32("$rnd", 220),
                        [
                            p.if.void(
                                p.is.lesser.ui32("$rnd", 2),
                                [
                                    makeInnerFunc(
                                        p,
                                        "f1",
                                        0,
                                        0,
                                        0,
                                        0.25,
                                        0,
                                        -0.4
                                    ),
                                ],
                                [
                                    makeInnerFunc(
                                        p,
                                        "f2",
                                        0.85,
                                        0.04,
                                        -0.04,
                                        0.85,
                                        0,
                                        1.6
                                    ),
                                ]
                            ),
                        ],
                        [
                            p.if.void(
                                p.is.lesser.ui32("$rnd", 238),
                                [
                                    makeInnerFunc(
                                        p,
                                        "f3",
                                        0.2,
                                        -0.26,
                                        0.23,
                                        0.22,
                                        0,
                                        1.6
                                    ),
                                ],
                                [
                                    makeInnerFunc(
                                        p,
                                        "f4",
                                        -0.15,
                                        0.28,
                                        0.26,
                                        0.24,
                                        0,
                                        0.44
                                    ),
                                ]
                            ),
                        ]
                    )
                ),
                p.call.void("plot", p.get.f32("x"), p.get.f32("y")),
                p.poke.f32("@pos", p.get.f32("x")),
                p.poke.f32("@pos+1", p.get.f32("y")),
                p.poke.i32("@index", p.get.i32("idx1")),
                p.poke.i32("@index+1", p.get.i32("idx2"))
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
        // window.requestAnimationFrame(anim)
    }
    window.requestAnimationFrame(anim)
}

function rnd(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min))
}

function makeInnerFunc(
    p: Program,
    name: string,
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
): Instruction<"void"> {
    return p.bloc.void(
        p.poke.f32(p.$memory.get("pos").offset, `(${a}*$x) + (${b}*$y) + ${c}`),
        p.poke.f32(
            p.add.i32(1, p.$memory.get("pos").offset),
            `(${d}*$x) + (${e}*$y) + ${f}`
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
