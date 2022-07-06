import { InstrType, Instruction } from "../../types"

export default class Zero {
    readonly i32 = make("i32")
    readonly i64 = make("i64")
}

function make<T extends InstrType>(type: T) {
    return (a: Instruction<T>): Instruction<"bool"> => {
        return {
            type: "bool",
            code: [a, `${type}.eqz`],
        }
    }
}
