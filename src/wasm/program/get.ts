import Program from "./program"
import { Instruction, LocalType } from "./../types"

type GetFunc<T extends LocalType> = (name: string) => Instruction<T>

export default class Get {
    readonly i32: GetFunc<"i32">
    readonly i64: GetFunc<"i64">
    readonly f32: GetFunc<"f32">
    readonly f64: GetFunc<"f64">

    constructor(prg: Program) {
        this.i32 = make("i32", prg)
        this.i64 = make("i64", prg)
        this.f32 = make("f32", prg)
        this.f64 = make("f64", prg)
    }
}

function make<T extends LocalType>(type: T, prg: Program) {
    return (name: string): Instruction<T> => {
        prg.$declareLocal(name, type)
        return {
            type,
            code: `local.get $${name}_${type}`,
        }
    }
}
