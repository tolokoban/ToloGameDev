import Internals from "./internals"
import Wabt from "wabt"
import { isNumber, isObject } from "../../../tools/guards"
import { stringifyCode } from "../../stringify"
import {
    MemoryItem,
    ProgramBuildMemory,
    InstrCode,
    PartialProgramOptions,
    ProgramBuild,
    ProgramMainFunction,
    ProgramOptions,
    ProgramOptionsMemory,
} from "../../types"

export default class Compilable extends Internals {
    protected readonly _options: ProgramOptions
    public readonly $memory: {
        readonly enabled: boolean
        get(name: string): MemoryItem
    }

    constructor(options: PartialProgramOptions) {
        super()
        this._options = makeOptions(options)
        const { memory } = this._options
        this.$memory = {
            get enabled() {
                return typeof memory !== "undefined"
            },

            get(name: string) {
                if (!memory)
                    throw Error(
                        `Trying to access memory "${name}", but none has been defined for this program!`
                    )

                const item: MemoryItem | undefined = memory[name]
                if (!item)
                    throw Error(
                        `Memory "${name}" does not exist!\nPossible names are: ${Object.keys(
                            memory
                        )
                            .map((n) => `"${n}"`)
                            .join(", ")}`
                    )

                return item
            },
        }
    }

    async compile<IN extends number[] = [], OUT extends void | number = void>(
        value: InstrCode | string
    ): Promise<ProgramBuild<IN, OUT>> {
        const options = this._options
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
            const memorySizeInBytes = computeTotalMemorySize(options.memory)
            const MEMORY_PAGE_SIZE = 64 * 1024
            const memorySizeInPages = Math.ceil(
                memorySizeInBytes / MEMORY_PAGE_SIZE
            )
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
            let buffer: ArrayBuffer | undefined = undefined
            if (memorySizeInPages > 0) {
                const memory = new WebAssembly.Memory({
                    initial: memorySizeInPages,
                    maximum: memorySizeInPages,
                })
                importObject.env = {
                    mem: memory,
                }
                buffer = memory.buffer
            }
            const instance = await WebAssembly.instantiate(module, importObject)
            return {
                main: instance.exports.main as ProgramMainFunction<IN, OUT>,
                memory: exportMemory(this._options.memory, buffer),
                sourceCode,
            }
        } catch (ex) {
            console.error("Unable to compile following WAT code:", ex)
            console.log(sourceCode)
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

function makeOptions(options: PartialProgramOptions): ProgramOptions {
    const result: ProgramOptions = {}
    if (options.memory) {
        let offset = 0
        result.memory = {}
        for (const name of Object.keys(options.memory)) {
            const def = options.memory[name]
            const item = {
                type: def.type,
                size: 0,
                cols: 0,
                rows: 0,
                offset,
            }
            if (hasSize(def)) {
                item.size = def.size
                item.cols = def.size
                item.rows = 1
            } else if (hasColsAndRows(def)) {
                item.size = def.cols * def.rows
                item.cols = def.cols
                item.rows = def.rows
            }
            result.memory[name] = item
            offset += item.size
        }
    }
    return result
}

function hasSize(data: unknown): data is { size: number } {
    return isObject(data) && isNumber(data.size)
}

function hasColsAndRows(data: unknown): data is { cols: number; rows: number } {
    return isObject(data) && isNumber(data.cols) && isNumber(data.rows)
}

function computeTotalMemorySize(memory?: ProgramOptionsMemory) {
    if (!memory) return 0

    let size = 0
    for (const key of Object.keys(memory)) {
        const item = memory[key]
        size += item.size
    }
    return size
}

/**
 * The WebAssemble linear memory can be viewed as many TypedArrays.
 */
function exportMemory(
    memory: ProgramOptionsMemory | undefined,
    buffer: ArrayBuffer | undefined
): ProgramBuildMemory {
    if (!memory || !buffer)
        return {
            Float32: {},
            Uint8Clamped: {},
        }

    let offset = 0
    const output: ProgramBuildMemory = {
        Float32: {},
        Uint8Clamped: {},
    }
    const arrayFloat32 = new Float32Array(buffer)
    const arrayUint8Clamped = new Uint8ClampedArray(buffer)
    for (const id of Object.keys(memory)) {
        const item = memory[id]
        switch (item.type) {
            case "Float32":
                if (item.data) item.size = item.data.byteLength
                output.Float32[id] = arrayFloat32.subarray(
                    offset >> 2,
                    (offset + item.size) >> 2
                )
                if (item.data) output.Float32[id].set(item.data)
                break
            case "Uint8Clamped":
                if (item.data) item.size = item.data.byteLength
                output.Uint8Clamped[id] = arrayUint8Clamped.subarray(
                    offset,
                    offset + item.size
                )
                if (item.data) output.Uint8Clamped[id].set(item.data)
                break
            default:
                throw Error(
                    `Memory of type "${item.type}" has not yet been implemented!`
                )
        }
    }
    return output
}
