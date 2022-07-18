import Program from "."
import { InstrType, Instruction, LocalType } from "../types"

export default class Bloc {
    readonly void = make("void")
    readonly bool = make("bool")
    readonly i32 = make("i32")
    readonly i64 = make("i64")
    readonly f32 = make("f32")
    readonly f64 = make("f64")
}

function make<T extends LocalType | "void">(type: T) {
    return (
        ...params: [...Instruction<"void">[], Instruction<T>]
    ): Instruction<T> => ({
        type,
        code: [...params],
    })
}
