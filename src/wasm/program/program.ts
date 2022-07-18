import Add from "./add"
import Bloc from "./bloc"
import Bool from "./bool"
import Calc from "./calc"
import Call from "./call"
import Compilable from "./compilable"
import Const from "./const"
import Dec from "./dec"
import DecAndGet from "./dec-and-get"
import Declare from "./declare"
import Flow from "./flow"
import Get from "./get"
import If from "./if"
import Inc from "./inc"
import IncAndGet from "./inc-and-get"
import Is from "./is"
import Log from "./log"
import Mul from "./mul"
import Nearest from "./nearest"
import Param from "./param"
import Peek from "./peek"
import Poke from "./poke"
import Set from "./set"
import SetAndGet from "./set-and-get"
import Sub from "./sub"
import {
    InstrType,
    InstrOrConst,
    Instruction,
    LocalType,
    PartialProgramOptions,
} from "../types"

/**
 * https://developer.mozilla.org/en-US/docs/webassembly/reference/numeric/remainder
 * https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md#integer-arithmetic-instructions
 */
export default class Program extends Compilable {
    constructor(options: PartialProgramOptions = {}) {
        super(options)
    }

    readonly add = new Add(this)
    readonly bloc = new Bloc()
    readonly bool = new Bool()
    readonly calc = new Calc(this)
    readonly call = new Call(this)
    readonly const = new Const()
    readonly dec = new Dec(this)
    readonly decAndGet = new DecAndGet(this)
    readonly declare = new Declare(this)
    readonly flow = new Flow(this)
    readonly get = new Get(this)
    readonly inc = new Inc(this)
    readonly incAndGet = new IncAndGet(this)
    readonly if = new If(this)
    readonly is = new Is(this)
    readonly log = new Log(this)
    readonly mul = new Mul(this)
    readonly nearest = new Nearest()
    readonly param = new Param(this)
    readonly peek = new Peek(this)
    readonly poke = new Poke(this)
    readonly set = new Set(this)
    readonly setAndGet = new SetAndGet(this)
    readonly sub = new Sub(this)

    comment(...instructions: Instruction<InstrType>[]): Instruction<"void"> {
        return {
            type: "void",
            code: ["(;", ...instructions, ";)"],
        }
    }

    ensureInstr<T extends LocalType>(
        value: InstrOrConst<T>,
        type: T
    ): Instruction<T> {
        if (typeof value === "string") {
            switch (type) {
                case "bool":
                case "i32":
                    return this.calc.i32(value) as Instruction<T>
                case "i64":
                    return this.calc.i64(value) as Instruction<T>
                case "f32":
                    return this.calc.f32(value) as Instruction<T>
                case "f64":
                    return this.calc.f64(value) as Instruction<T>
                default:
                    throw Error(`Unknown type "${type}"!`)
            }
        }

        if (typeof value !== "number") return value

        return {
            type,
            code: `${type}.const ${value}`,
        }
    }
}
