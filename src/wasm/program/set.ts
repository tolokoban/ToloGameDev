import Program from "."
import { Instruction, LocalType } from "./../types"

type SetFunc<T extends LocalType> = (
    name: string,
    value?: Instruction<T> | number
) => Instruction<"void">

export default class Set {
    readonly i32: SetFunc<"i32" | "bool">
    readonly i64: SetFunc<"i64">
    readonly f32: SetFunc<"f32">
    readonly f64: SetFunc<"f64">

    constructor(prg: Program) {
        this.i32 = make("i32", prg)
        this.i64 = make("i64", prg)
        this.f32 = make("f32", prg)
        this.f64 = make("f64", prg)
    }
}

function make<T extends LocalType>(type: T, prg: Program) {
    return (
        name: string,
        value: Instruction<T> | number = 0
    ): Instruction<"void"> => {
        const realValue =
            typeof value === "number" ? `${type}.const ${value}` : value
        prg.$declareLocal(name, type)
        return {
            type: "void",
            code: [realValue, `local.set $${name}_${type}`],
        }
    }
}
