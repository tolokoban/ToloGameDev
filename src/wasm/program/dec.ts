import Program from "./program"
import { InstrType, Instruction, LocalType } from "../types"

type DecAndGetFunc<T extends LocalType> = (
    name: string,
    delta?: Instruction<T> | number
) => Instruction<"void">

export default class DecAndGet {
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
    ): Instruction<"void"> => {
        prg.$locals.add(local, type)
        const value =
            typeof delta === "number" ? `${type}.const ${delta}` : delta
        return {
            type: "void",
            code: [
                `local.get $${local}`,
                value,
                `${type}.sub`,
                `local.set $${local}`,
            ],
        }
    }
}
