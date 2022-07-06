import { InstrType, Instruction } from "../types"

export default class Const {
    readonly i32 = make("i32")
    readonly i64 = make("i64")
    readonly f32 = make("f32")
    readonly f64 = make("f64")
}

function make<T extends InstrType>(type: T) {
    return (value: number): Instruction<T> => {
        return {
            type,
            code: `${type}.const ${value}`,
        }
    }
}
