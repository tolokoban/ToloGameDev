import { InstrType, Instruction } from "../../types"

export default class Nearest {
    readonly i32 = make("f32", "i32")
    readonly i64 = make("f64", "i64")
}

function make<IN extends "f32" | "f64", OUT extends "i32" | "i64">(
    typeIn: IN,
    typeOut: OUT
) {
    return (floatValue: Instruction<IN>): Instruction<OUT> => {
        return {
            type: typeOut,
            code: [floatValue, `${typeIn}.nearest`],
        }
    }
}
