import Program from "./program"
import { InstrOrConst, Instruction, LocalType } from "../types"

type PeekFunc<T extends LocalType> = (
    offset: InstrOrConst<"i32">
) => Instruction<T>

export default class Peek {
    readonly i32: PeekFunc<"i32">
    readonly i32For8s: PeekFunc<"i32">
    readonly i32For8u: PeekFunc<"i32">
    readonly i32For16s: PeekFunc<"i32">
    readonly i32For16u: PeekFunc<"i32">
    readonly i64: PeekFunc<"i64">
    readonly i64For8s: PeekFunc<"i64">
    readonly i64For8u: PeekFunc<"i64">
    readonly i64For16s: PeekFunc<"i64">
    readonly i64For16u: PeekFunc<"i64">
    readonly i64For32s: PeekFunc<"i64">
    readonly i64For32u: PeekFunc<"i64">
    readonly f32: PeekFunc<"f32">
    readonly f64: PeekFunc<"f64">

    constructor(prg: Program) {
        this.i32 = make("i32", prg)
        this.i32For8s = make("i32", prg, "8_s")
        this.i32For8u = make("i32", prg, "8_u")
        this.i32For16s = make("i32", prg, "16_s")
        this.i32For16u = make("i32", prg, "16_u")
        this.i64 = make("i64", prg)
        this.i64For8s = make("i64", prg, "8_s")
        this.i64For8u = make("i64", prg, "8_u")
        this.i64For16s = make("i64", prg, "16_s")
        this.i64For16u = make("i64", prg, "16_u")
        this.i64For32s = make("i64", prg, "32_s")
        this.i64For32u = make("i64", prg, "32_u")
        this.f32 = make("f32", prg)
        this.f64 = make("f64", prg)
    }
}

function make<T extends LocalType>(
    type: T,
    prg: Program,
    extension: string = ""
): PeekFunc<T> {
    return (offset: InstrOrConst<"i32">): Instruction<T> => {
        return {
            type: type,
            code: [prg.ensureInstr(offset, "i32"), `${type}.load${extension}`],
        }
    }
}
