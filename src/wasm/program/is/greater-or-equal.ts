import { InstrType, Instruction } from "../../types"

export default class GreaterOrEqual {
    readonly ui32 = make("i32", "_u")
    readonly ui64 = make("i64", "_u")
    readonly si32 = make("i32", "_s")
    readonly si64 = make("i64", "_s")
    readonly f32 = make("f32")
    readonly f64 = make("f64")
}

function make<T extends InstrType>(type: T, extension: "" | "_u" | "_s" = "") {
    return (a: Instruction<T>, b: Instruction<T>): Instruction<"bool"> => {
        return {
            type: "bool",
            code: [a, b, `${type}.ge${extension}`],
        }
    }
}
