import Program from "./program"
import { InstrOrConst, Instruction, LocalType } from "../types"

type PokeFunc<T extends LocalType> = (
    offset: InstrOrConst<"i32">,
    value: InstrOrConst<T>
) => Instruction<"void">

export default class Poke {
    readonly i32: PokeFunc<"i32">
    readonly i32For8: PokeFunc<"i32">
    readonly i32For16: PokeFunc<"i32">
    readonly i64: PokeFunc<"i64">
    readonly i64For8: PokeFunc<"i64">
    readonly i64For16: PokeFunc<"i64">
    readonly i64For32: PokeFunc<"i64">
    readonly f32: PokeFunc<"f32">
    readonly f64: PokeFunc<"f64">

    constructor(prg: Program) {
        this.i32 = make("i32", prg)
        this.i32For8 = make("i32", prg, "8")
        this.i32For16 = make("i32", prg, "16")
        this.i64 = make("i64", prg)
        this.i64For8 = make("i64", prg, "8")
        this.i64For16 = make("i64", prg, "16")
        this.i64For32 = make("i64", prg, "32")
        this.f32 = make("f32", prg)
        this.f64 = make("f64", prg)
    }
}

function make<T extends LocalType>(
    type: T,
    prg: Program,
    extension: string = ""
): PokeFunc<T> {
    return (
        offset: InstrOrConst<"i32">,
        value: InstrOrConst<T>
    ): Instruction<"void"> => ({
        type: "void",
        code: [
            prg.ensureInstr(offset, "i32"),
            prg.ensureInstr(value, type),
            `${type}.store${extension}`,
        ],
    })
}
