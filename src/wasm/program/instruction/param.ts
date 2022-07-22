import Program from ".."
import { Instruction, WasmType } from "../../types"

type ParamFunc<T extends WasmType> = (name: string) => Instruction<T>

export default class Params {
    readonly i32: ParamFunc<"i32">
    readonly i64: ParamFunc<"i64">
    readonly f32: ParamFunc<"f32">
    readonly f64: ParamFunc<"f64">

    constructor(prg: Program) {
        this.i32 = make("i32", prg)
        this.i64 = make("i64", prg)
        this.f32 = make("f32", prg)
        this.f64 = make("f64", prg)
    }
}

function make<T extends WasmType>(type: T, prg: Program): ParamFunc<T> {
    return (name: string): Instruction<T> => {
        const expectedType = prg.$params.get(name)
        if (expectedType !== type) {
            throw Error(
                `Param $${name} is of type "${expectedType}" an not "${type}"!`
            )
        }
        return {
            type,
            code: `local.get $${name}`,
        }
    }
}
