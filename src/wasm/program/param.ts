import Program from "."
import { Instruction, LocalType } from "../types"

type ParamFunc<T extends LocalType> = (name: string) => Instruction<T>

export default class Params {
    readonly i32: ParamFunc<"i32">
    readonly i64: ParamFunc<"i64">
    readonly f32: ParamFunc<"f32">
    readonly f64: ParamFunc<"f64">

    constructor(prg: Program) {
        this.i32 = make("i32", prg)
        this.i64 = make("i64", prg)
        this.f32 = make("f32", prg)
        this.f64 = make("f64", prg)
    }
}

function make<T extends LocalType>(type: T, prg: Program): ParamFunc<T> {
    return (name: string): Instruction<T> => ({
        type,
        code: `local.get $${name}`,
        before: () => prg.$assertParam(name, type),
    })
}
