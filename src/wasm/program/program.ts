import Add from "./instruction/add"
import And from "./instruction/and"
import Bloc from "./instruction/bloc"
import Bool from "./instruction/bool"
import Calc from "./instruction/calc"
import Call from "./instruction/call"
import Compilable from "./compilable"
import Const from "./instruction/const"
import Dec from "./instruction/dec"
import DecAndGet from "./instruction/dec-and-get"
import Declare from "./instruction/declare"
import Flow from "./instruction/flow"
import Get from "./instruction/get"
import If from "./instruction/if"
import Inc from "./instruction/inc"
import IncAndGet from "./instruction/inc-and-get"
import Is from "./instruction/is"
import Log from "./instruction/log"
import Mul from "./instruction/mul"
import Nearest from "./instruction/nearest"
import Param from "./instruction/param"
import Peek from "./instruction/peek"
import Poke from "./instruction/poke"
import Set from "./instruction/set"
import SetAndGet from "./instruction/set-and-get"
import Shl from "./instruction/shl"
import Sub from "./instruction/sub"
import {
    InstrType,
    InstrOrConst,
    Instruction,
    WasmType,
    PartialProgramOptions,
} from "../types"

/**
 * https://developer.mozilla.org/en-US/docs/webassembly/reference/numeric/remainder
 * https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md#integer-arithmetic-instructions
 */
export default class Program extends Compilable {
    constructor(options: PartialProgramOptions = {}) {
        super(options)
        // console.log("Memory size (in bytes):", this.$memory.sizeInBytes)
    }

    readonly add = new Add(this)
    readonly and = new And(this)
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
    readonly shl = new Shl(this)
    readonly sub = new Sub(this)

    comment(...instructions: Instruction<InstrType>[]): Instruction<"void"> {
        return {
            type: "void",
            code: ["(;", ...instructions, ";)"],
        }
    }

    ensureInstr<T extends WasmType>(
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
