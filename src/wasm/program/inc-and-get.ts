import Program from "."
import { InstrType, Instruction, LocalType } from "../types"

type DecAndGetFunc<T extends LocalType> = (
    name: string,
    delta: Instruction<T> | number
) => Instruction<T>

export default class IncAndGet {
    readonly i32: DecAndGetFunc<"i32">
    readonly i64: DecAndGetFunc<"i64">
    readonly f32: DecAndGetFunc<"f32">
    readonly f64: DecAndGetFunc<"f64">

    constructor(prg: Program) {
        this.i32 = make("i32", prg)
        this.i64 = make("i64", prg)
        this.f32 = make("f32", prg)
        this.f64 = make("f64", prg)
    }
}

function make<T extends LocalType>(type: T, prg: Program) {
    return (
        local: string,
        delta: Instruction<T> | number = 1
    ): Instruction<T> => {
        prg.$declareLocal(local, type)
        const value =
            typeof delta === "number" ? `${type}.const ${delta}` : delta
        return {
            type,
            code: [
                `local.get $${local}_${type}`,
                value,
                `${type}.add`,
                `local.tee $${local}_${type}`,
            ],
        }
    }
}
