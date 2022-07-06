import Add from "./add"
import Const from "./const"
import Get from "./get"
import Flow from "./flow"
import Is from "./is"
import Mul from "./mul"
import Param from "./param"
import Set from "./set"
import SetAndGet from "./set-and-get"
import Sub from "./sub"
import Dec from "./dec"
import Inc from "./inc"
import DecAndGet from "./dec-and-get"
import { InstrCode, LocalType } from "../types"

const INDENT = "  "

/**
 * https://developer.mozilla.org/en-US/docs/webassembly/reference/numeric/remainder
 * https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md#integer-arithmetic-instructions
 */
export default class Program {
    static stringify(code: InstrCode, indent = ""): string {
        if (typeof code === "function") return Program.stringify(code(), indent)
        if (typeof code === "string") return `${indent}${code}\n`

        if (Array.isArray(code)) {
            const subIndent = `${INDENT}${indent}`
            return code.map((x) => Program.stringify(x, subIndent)).join("")
        }

        return Program.stringify(code.code, indent)
    }

    private _id = 1

    private readonly _locals = new Map<string, LocalType>()

    $declareLocal(name: string, type: LocalType) {
        this._locals.set(`${name}_${type}`, type)
    }

    $getLocals() {
        return Array.from(this._locals.entries())
            .map(([name, type]) => `(local $${name} ${type})`)
            .join(" ")
    }

    $makeId(name: string) {
        return `${name}_${this._id++}`
    }

    readonly inc = new Inc(this)
    readonly dec = new Dec(this)
    readonly decAndGet = new DecAndGet(this)
    readonly add = new Add()
    readonly sub = new Sub()
    readonly mul = new Mul()
    readonly const = new Const()
    readonly get = new Get()
    readonly set = new Set(this)
    readonly setAndGet = new SetAndGet()
    readonly param = new Param()
    readonly is = new Is()
    readonly flow = new Flow(this)

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
