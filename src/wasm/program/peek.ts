import Program from "./program"
import { InstrOrConst, Instruction, LocalType } from "../types"

type PeekFunc<T extends LocalType> = (
    offset: InstrOrConst<"i32">
) => Instruction<T>

export default class Peek {
    readonly i32: PeekFunc<"i32">
    readonly i64: PeekFunc<"i64">
    readonly f32: PeekFunc<"f32">
    readonly f64: PeekFunc<"f64">

    constructor(prg: Program) {
        this.i32 = make("i32", prg)
        this.i64 = make("i64", prg)
        this.f32 = make("f32", prg)
        this.f64 = make("f64", prg)
    }
}

function make<T extends LocalType>(type: T, prg: Program): PeekFunc<T> {
    return (offset: InstrOrConst<"i32">): Instruction<T> => {
        return {
            type,
            code: [prg.ensureInstr(offset, "i32"), `${type}.load`],
        }
    }
}
