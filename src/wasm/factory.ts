import Program from "./program/program"
import Wabt from "wabt"

const INDENT = "  "

// export async function makeImageDataPainter(
//     [width, height]: [number, number],
//     ...instr: InstrVoid[]
// ): Promise<(time: number) => ImageData> {
//     const memory = new WebAssembly.Memory({ initial: 1 })
//     const bufferSize = width * height * 4
//     const importObject = {
//         env: {
//             buffer: memory,
//         },
//     }

//     const imageData = new ImageData(
//         new Uint8ClampedArray(memory.buffer, 0, bufferSize),
//         width,
//         height
//     )

//     const ctx = new Context()
//     ctx.push(
//         "(module",
//         [
//             '(import "env" "buffer" (memory 1))',
//             "(func $go (param $time i32)",
//             // [Code.declareLocals()],
//             // [...instr],
//             ")",
//             '(export "go" (func $go))',
//         ],
//         ")"
//     )
//     const wat = ctx.toString()
//     console.log(wat)
//     const wabt = await Wabt()
//     const compiler = wabt.parseWat("<inline>", wat)
//     compiler.resolveNames()
//     compiler.validate()
//     const binary = compiler.toBinary({ log: true, write_debug_names: true })
//     // console.log(binary.log)
//     const buffer = binary.buffer
//     compiler.destroy()
//     const module = await WebAssembly.compile(buffer)
//     const instance = await WebAssembly.instantiate(module, importObject)
//     const go = instance.exports.go as (time: number) => ImageData
//     return (time: number) => {
//         go(time)
//         return imageData
//     }
// }
