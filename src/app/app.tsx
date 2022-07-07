import * as React from "react"
import Program from "../wasm/program"
import "./app.css"

export default function App() {
    return (
        <div>
            <canvas ref={onCanvasReady} width={128} height={128}></canvas>
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

    const p = new Program()
    const build = await p.compile<[count: number], number>(
        p.flow.module({
            main: p.flow.func.i32(
                "main",
                { count: "i32" },
                p.set.i32("accu"),
                p.set.i32("loop", p.param.i32("count")),
                p.flow.repeat("loop", p.inc.i32("accu", p.get.i32("loop"))),
                p.get.i32("accu")
            ),
        })
    )

    console.log("🚀 [app] build.sourceCode = ", build.sourceCode) // @FIXME: Remove this line written on 2022-07-07 at 15:51

    console.log("Runtime:", build.main(5))
    console.log("Runtime:", build.main(6))

    // const paint = await makeImageDataPainter(
    //     [width, height],
    //     Code.poke_i32(
    //         Code.mod_i32(Code.param_i32("time"), Code.i32(width * height)),
    //         Code.i32(0xff0088ff)
    //     )
    // )

    // function animate(time: number) {
    //     if (ctx) ctx.putImageData(paint(time), 0, 0)
    //     requestAnimationFrame(animate)
    // }
    // requestAnimationFrame(animate)
}
