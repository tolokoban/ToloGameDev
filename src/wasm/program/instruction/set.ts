import Program from "../program"
import { Instruction, WasmType } from "../../types"

type SetFunc<T extends WasmType> = (
    name: string,
    value?: Instruction<T> | number | string
) => Instruction<"void">

export default class Set {
    readonly bool: SetFunc<"bool">
    readonly i32: SetFunc<"i32">
    readonly i64: SetFunc<"i64">
    readonly f32: SetFunc<"f32">
    readonly f64: SetFunc<"f64">

    constructor(prg: Program) {
        this.bool = make("bool", prg)
        this.i32 = make("i32", prg)
        this.i64 = make("i64", prg)
        this.f32 = make("f32", prg)
        this.f64 = make("f64", prg)
    }
}

function make<T extends WasmType>(type: T, prg: Program) {
    return (
        name: string,
        value: Instruction<T> | number | string = 0
    ): Instruction<"void"> => {
        const realValue = prg.ensureInstr(value, type)
        prg.$locals.add(name, type)
        return {
            type: "void",
            code: [realValue, `local.set $${name}`],
        }
    }
}
