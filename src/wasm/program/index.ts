import Add from "./add"
import Const from "./const"
import Dec from "./dec"
import DecAndGet from "./dec-and-get"
import Flow from "./flow"
import Get from "./get"
import Inc from "./inc"
import IncAndGet from "./inc-and-get"
import Is from "./is"
import Log from "./log"
import Mul from "./mul"
import Param from "./param"
import Set from "./set"
import SetAndGet from "./set-and-get"
import Sub from "./sub"
import Wabt from "wabt"
import { InstrCode, LocalType } from "../types"

const INDENT = "  "

export interface ProgramOptions {
    /** Number of bytes to allocate for memory */
    memory?: number
}

type ProgramMainFunction<
    IN extends number[] = [],
    OUT extends void | number = void
> = (...args: IN) => OUT

export interface ProgramBuild<
    IN extends number[] = [],
    OUT extends void | number = void
> {
    buffer?: ArrayBuffer
    main: ProgramMainFunction<IN, OUT>
    sourceCode: string
}

/**
 * https://developer.mozilla.org/en-US/docs/webassembly/reference/numeric/remainder
 * https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md#integer-arithmetic-instructions
 */
export default class Program {
    static stringify(code: InstrCode, ctx = { indent: 0 }): string {
        if (typeof code === "string") {
            let relativeIndent = 0
            for (const c of code) {
                if (c === "(") relativeIndent++
                else if (c === ")") relativeIndent--
            }
            if (relativeIndent < 0) ctx.indent += relativeIndent
            const indent = makeIndent(ctx.indent)
            if (relativeIndent > 0) ctx.indent += relativeIndent
            return `${indent}${code}\n`
        }

        if (Array.isArray(code)) {
            return code.map((x) => Program.stringify(x, ctx)).join("")
        }

        if (code.before) code.before()
        const result = Program.stringify(code.code, ctx)
        if (code.after) code.after()
        return result
    }

    async compile<IN extends number[] = [], OUT extends void | number = void>(
        value: InstrCode | string,
        options: ProgramOptions = {}
    ): Promise<ProgramBuild<IN, OUT>> {
        const sourceCode =
            typeof value === "string" ? value : Program.stringify(value)
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
            const MEMORY_PAGE_SIZE = 64 * 1024
            const memorySize = Math.ceil(
                (options.memory ?? 0) / MEMORY_PAGE_SIZE
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
            if (memorySize > 0) {
                const memory = new WebAssembly.Memory({
                    initial: memorySize,
                    maximum: memorySize,
                })
                importObject.env = {
                    mem: memory,
                }
                buffer = memory.buffer
            }
            const instance = await WebAssembly.instantiate(module, importObject)
            return {
                main: instance.exports.main as ProgramMainFunction<IN, OUT>,
                buffer,
                sourceCode,
            }
        } catch (ex) {
            console.error("Unable to compile following WAT code:", ex)
            console.log(sourceCode)
            throw Error(ex)
        }
    }

    private _id = 1
    private _params: { [name: string]: LocalType } = {}
    private _textResources: string[] = []

    private readonly _locals = new Map<string, LocalType>()

    get $textResources() {
        return [...this._textResources]
    }

    $addTextResource(text: string): number {
        if (!this._textResources.includes(text)) this._textResources.push(text)
        return this._textResources.indexOf(text)
    }

    $declareParams(params: { [name: string]: LocalType }) {
        this._params = params
    }

    /**
     * Check if there is a declared param `name` of `type`.
     * Otherwise, throw an exception.
     */
    $assertParam(name: string, type: string) {
        const actualType = this._params[name]
        if (!actualType)
            throw Error(
                `Param "${name}" (${type}) has not been declared in the current function!`
            )
        if (type !== actualType)
            throw Error(
                `Param "${name}" (${type}) has been declared with type "${actualType}"!`
            )
    }

    $declareLocal(name: string, type: LocalType) {
        this._locals.set(`${name}`, type)
    }

    $getLocals() {
        return Array.from(this._locals.entries())
            .map(([name, type]) => `(local $${name}_${type} ${type})`)
            .join(" ")
    }

    $getLocalType(name: string): LocalType {
        const type = this._locals.get(name)
        if (!type)
            throw Error(
                `No local was declared with the name $${name}!\nPossible names are: ${Array.from(
                    this._locals.keys()
                )
                    .map((n) => `$${n}`)
                    .join(", ")}`
            )

        return type
    }

    $getParamType(name: string): LocalType {
        const type = this._params[name]
        if (!type) throw Error(`No param was declared with the name $${name}!`)

        return type
    }

    $makeId(name: string) {
        return `${name}_${this._id++}`
    }

    readonly add = new Add()
    readonly const = new Const()
    readonly dec = new Dec(this)
    readonly decAndGet = new DecAndGet(this)
    readonly flow = new Flow(this)
    readonly get = new Get(this)
    readonly inc = new Inc(this)
    readonly incAndGet = new IncAndGet(this)
    readonly is = new Is()
    readonly log = new Log(this)
    readonly mul = new Mul()
    readonly param = new Param(this)
    readonly set = new Set(this)
    readonly setAndGet = new SetAndGet(this)
    readonly sub = new Sub()

    // poke_i32(offset: InstrI32, value: InstrI32): InstrVoid {
    //     return (code: Code) => {
    //         code.push(offset, value, "i32.store")
    //         return VOID
    //     }
    // }

    // mod_i32(a: InstrI32, b: InstrI32): InstrI32 {
    //     return (code: Code) => {
    //         code.push(a, b, "i32.rem_u")
    //         return I32
    //     }
    // }
}

function makeIndent(value: number): string {
    let txt = ""
    for (let i = 0; i < value; i++) txt += INDENT
    return txt
}

function makeLogValueFunc(textResources: string[]) {
    return (index: number, value: number) =>
        console.log("[WASM]  ", textResources[index], value)
}

function makeLogTextFunc(textResources: string[]) {
    return (index: number) => console.log("[WASM]  ", textResources[index])
}
