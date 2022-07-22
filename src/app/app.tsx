import * as React from "react"
import Program from "../wasm/program/program"
import { Instruction } from "../wasm/types"
import "./app.css"

const CANVAS_W = 1024
const CANVAS_H = 1024

export default function App() {
    return (
        <div>
            <canvas
                ref={onCanvasReady}
                width={CANVAS_W}
                height={CANVAS_H}
            ></canvas>
            <br />
            <button>Start</button>
        </div>
    )
}

async function test(canvas: HTMLCanvasElement) {
    const p = new Program({
        memory: {
            main: new Float32Array([0.3, 1.2, 2.1, 3.0]),
            more: new Uint8ClampedArray([0, 11, 22, 33, 44]),
        },
    })
    console.log("🚀 ", new Float32Array(p.$memory.wasmMemory.buffer)) // @FIXME: Remove this line written on 2022-07-22 at 12:41
    const build = await p.compile(
        p.flow.module(p.flow.func.f32({}, p.calc.f32("@more[2]")))
    )
    console.log(build.sourceCode)
    console.log("🚀 [app] build.main() = ", build.main()) // @FIXME: Remove this line written on 2022-07-22 at 12:39
}

async function onCanvasReady(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) throw Error("Unable to creater Canvas 2D context!")

    const { width, height } = canvas
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.clearRect(0, 0, width, height)

    const p = new Program({
        memory: {
            data: new Uint8ClampedArray(4 * width * height),
            pos: new Float32Array([0, 0]),
            index: new Int32Array([0, 1]),
            rnd: makeRandomUint8(0x10000),
        },
    })

    const cols = width * 4
    const STEP = 1
    const XMIN = -2.18
    const XMAX = 2.64
    const YMIN = 0
    const YMAX = 10
    const build = await p.compile<[loops: number]>(
        p.flow.module(
            p.flow.func.void(
                { name: "plot" },
                p.declare.params({
                    x: "f32",
                    y: "f32",
                }),
                p.if.void(
                    p.and.bool(
                        p.is.greater.f32("$x", XMIN),
                        p.is.lesser.f32("$x", XMAX),
                        p.is.greater.f32("$y", YMIN),
                        p.is.lesser.f32("$y", YMAX)
                    ),
                    [
                        p.set.i32(
                            "X",
                            `($x ${XMIN < 0 ? `+` : `-`}${Math.abs(XMIN)}) * ${
                                width / (XMAX - XMIN)
                            }`
                        ),
                        p.set.i32(
                            "Y",
                            `($y ${YMIN < 0 ? `+` : `-`}${Math.abs(YMIN)}) * ${
                                height / (YMAX - YMIN)
                            }`
                        ),
                        p.set.i32("offset", `(4 * $X) + (${cols} * $Y)`),
                        p.set.i32("current", "@[$offset + 1]"),
                        p.if.void(p.is.lesser.ui32("$current", 256 - STEP), [
                            p.poke.i32For8("$offset + 3", 255),
                            p.poke.i32For8("$offset + 1", `${STEP} + $current`),
                        ]),
                    ]
                )
            ),
            p.flow.func.void(
                {},
                p.declare.params({
                    loops: "i32",
                }),
                p.set.i32("loop", "$loops"),
                p.set.f32("x", "@pos[0]"),
                p.set.f32("y", "@pos[1]"),
                p.set.i32("idx1", "@index[0]"),
                p.set.i32("idx2", "@index[1]"),
                p.flow.repeat(
                    "loop",
                    p.set.i32("idx1", "($idx1 + 31) & 0xffff"),
                    p.set.i32("idx2", "($idx2 + 71) & 0xffff"),
                    p.set.i32("rnd", "@rnd[$idx1] ^ @rnd[$idx2]"),
                    p.if.void(
                        p.is.lesser.ui32("$rnd", 220),
                        [
                            p.if.void(
                                p.is.lesser.ui32("$rnd", 2),
                                [makeInnerFunc(p, 0, 0, 0, 0, 0.16, 0, "f1")],
                                [
                                    makeInnerFunc(
                                        p,
                                        0.85,
                                        0.04,
                                        0,
                                        -0.04,
                                        0.85,
                                        1.6,
                                        "f2"
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
                                        0.2,
                                        -0.26,
                                        0,
                                        0.23,
                                        0.22,
                                        1.6,
                                        "f3"
                                    ),
                                ],
                                [
                                    makeInnerFunc(
                                        p,
                                        -0.15,
                                        0.28,
                                        0,
                                        0.26,
                                        0.24,
                                        0.44,
                                        "f4"
                                    ),
                                ]
                            ),
                        ]
                    ),
                    p.call.void("plot", p.get.f32("x"), p.get.f32("y"))
                ),
                p.poke.f32(0, "$x", "pos"),
                p.poke.f32(1, "$y", "pos"),
                p.poke.i32(0, "$idx1", "index"),
                p.poke.i32(1, "$idx2", "index")
                // p.log.local("f1"),
                // p.log.local("f2"),
                // p.log.local("f3"),
                // p.log.local("f4"),
                // p.log.local("idx1"),
                // p.log.local("idx2")
            )
        )
    )
    console.log(build.sourceCode)

    const imageData = new ImageData(
        build.memory.data as Uint8ClampedArray,
        width,
        height
    )

    const anim = () => {
        build.main(1000000)
        // console.log("🚀 [app] build.memory = ", build.memory) // @FIXME: Remove this line written on 2022-07-22 at 11:35
        // console.log("🚀 [app] build.memory.index = ", build.memory.index) // @FIXME: Remove this line written on 2022-07-22 at 11:35
        // console.log("🚀 [app] build.memory.pos = ", build.memory.pos) // @FIXME: Remove this line written on 2022-07-22 at 11:35
        if (ctx) ctx.putImageData(imageData, 0, 0)
        window.requestAnimationFrame(anim)
    }
    window.requestAnimationFrame(anim)
}

function rnd(min: number, max: number) {
    return Math.floor(min + Math.random() * (max - min))
}

function makeInnerFunc(
    p: Program,
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    name: string
): Instruction<"void"> {
    return p.bloc.void(
        p.inc.i32(name),
        p.set.f32("xx", `(${a}*$x) + (${b}*$y) + ${c}`),
        p.set.f32("yy", `(${d}*$x) + (${e}*$y) + ${f}`),
        p.set.f32("x", "$xx"),
        p.set.f32("y", "$yy")
    )
}

function makeRandomUint8(count: number): Uint8ClampedArray {
    const data: number[] = []
    for (let i = 0; i < count; i++) {
        data.push(rnd(0, 255))
    }
    return new Uint8ClampedArray(data)
}
