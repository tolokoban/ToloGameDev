import Internals from "./internals"
import MemoryManager from "../manager/memory-manager"
import Wabt from "wabt"
import { isNumber, isObject } from "../../../tools/guards"
import { stringifyCode } from "../../stringify"
import {
    InstrCode,
    PartialProgramOptions,
    ProgramBuild,
    ProgramMainFunction,
    ProgramOptions,
} from "../../types"

export default class Compilable extends Internals {
    protected readonly _options: ProgramOptions

    public readonly $memory: MemoryManager

    constructor(options: PartialProgramOptions) {
        super()
        this._options = options
        this.$memory = new MemoryManager(options.memory)
    }

    async compile<IN extends number[] = [], OUT extends void | number = void>(
        value: InstrCode | string
    ): Promise<ProgramBuild<IN, OUT>> {
        const sourceCode =
            typeof value === "string" ? value : stringifyCode(value)
        const wabt = await Wabt()
        try {
            const compiler = wabt.parseWat("<inline>", sourceCode)
            compiler.resolveNames()
            compiler.validate()
            const binary = compiler.toBinary({
                log: true,
                write_debug_names: true,
            })
            compiler.destroy()
            const module = await WebAssembly.compile(binary.buffer)
            const logValueFunc = makeLogValueFunc(this.$textResources)
            const importObject: WebAssembly.Imports = {
                log: {
                    i32: logValueFunc,
                    i64: logValueFunc,
                    f32: logValueFunc,
                    f64: logValueFunc,
                    text: makeLogTextFunc(this.$textResources),
                },
            }
            if (this.$memory.sizeInBytes > 0) {
                const memory = this.$memory.wasmMemory
                importObject.env = { mem: memory }
            }
            const instance = await WebAssembly.instantiate(module, importObject)
            return {
                main: instance.exports.main as ProgramMainFunction<IN, OUT>,
                memory: this.$memory.export(),
                sourceCode,
            }
        } catch (ex) {
            console.log(sourceCode)
            console.error("Unable to compile following WAT code:", ex)
            console.log(
                sourceCode
                    .split("\n")
                    .map(
                        (line, num) =>
                            `${`${num + 1}`.padStart(4, " ")} ${line}`
                    )
                    .join("\n")
            )
            throw Error(ex)
        }
    }
}

function makeLogValueFunc(textResources: string[]) {
    return (index: number, value: number) =>
        console.log("[WASM]  ", textResources[index], value)
}

function makeLogTextFunc(textResources: string[]) {
    return (index: number) => console.log("[WASM]  ", textResources[index])
}
