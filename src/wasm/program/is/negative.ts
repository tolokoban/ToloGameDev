import { InstrType, Instruction } from "../../types"

export default class Negative {
    readonly i32 = make("i32", "_s")
    readonly i64 = make("i64", "_s")
    readonly f32 = make("f32")
    readonly f64 = make("f64")
}

function make<T extends InstrType>(type: T, extension: "" | "_s" = "") {
    return (a: Instruction<T>): Instruction<"bool"> => {
        return {
            type: "bool",
            code: [
                a,
                `${type}.const 0`,
                `${type}.lt${extension} ;; Is strictly negative?`,
            ],
        }
    }
}
