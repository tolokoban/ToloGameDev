import Program from "../program"
import { InstrOrConst, Instruction, WasmType } from "../../types"

type GetFunc<T extends WasmType> = (name: string) => InstrOrConst<T>

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

function make<T extends WasmType>(type: T, prg: Program) {
    return (name: string, value: InstrOrConst<T> = 0): Instruction<T> => {
        const realValue = prg.ensureInstr(value, type)
        prg.$locals.add(name, type)
        return {
            type,
            code: [realValue, `(local.tee $${name})`],
        }
    }
}
