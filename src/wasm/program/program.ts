import Add from "./add"
import Bool from "./bool"
import Call from "./call"
import Compilable from "./compilable"
import Const from "./const"
import Dec from "./dec"
import DecAndGet from "./dec-and-get"
import Declare from "./declare"
import Flow from "./flow"
import Get from "./get"
import Inc from "./inc"
import IncAndGet from "./inc-and-get"
import Is from "./is"
import Log from "./log"
import Mul from "./mul"
import Param from "./param"
import Peek from "./peek"
import Poke from "./poke"
import Set from "./set"
import SetAndGet from "./set-and-get"
import Sub from "./sub"
import {
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
    readonly bool = new Bool()
    readonly call = new Call(this)
    readonly const = new Const()
    readonly dec = new Dec(this)
    readonly decAndGet = new DecAndGet(this)
    readonly declare = new Declare(this)
    readonly flow = new Flow(this)
    readonly get = new Get(this)
    readonly inc = new Inc(this)
    readonly incAndGet = new IncAndGet(this)
    readonly is = new Is()
    readonly log = new Log(this)
    readonly mul = new Mul(this)
    readonly param = new Param(this)
    readonly peek = new Peek(this)
    readonly poke = new Poke(this)
    readonly set = new Set(this)
    readonly setAndGet = new SetAndGet(this)
    readonly sub = new Sub(this)

    ensureInstr<T extends LocalType>(
        instrOrConst: InstrOrConst<T>,
        type: T
    ): Instruction<T> {
        if (typeof instrOrConst !== "number") return instrOrConst

        return {
            type,
            code: `${type}.const ${instrOrConst}`,
        }
    }
}
