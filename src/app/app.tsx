import * as React from "react"
import Code from "../wasm/code"
import { makeImageDataPainter } from "../wasm/factory"
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

    const paint = await makeImageDataPainter(
        [width, height],
        Code.poke_i32(
            Code.mod_i32(Code.param_i32("time"), Code.i32(width * height)),
            Code.i32(0xff0088ff)
        )
    )

    function animate(time: number) {
        if (ctx) ctx.putImageData(paint(time), 0, 0)
        requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
}
