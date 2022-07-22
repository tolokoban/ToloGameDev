import Program from ".."
import { InstrOrConst, Instruction, WasmType } from "../../types"

type IncFunc<T extends WasmType> = (
    name: string,
    delta?: InstrOrConst<T>
) => Instruction<"void">

export default class Inc {
    readonly i32: IncFunc<"i32">
    readonly i64: IncFunc<"i64">
    readonly f32: IncFunc<"f32">
    readonly f64: IncFunc<"f64">

    constructor(prg: Program) {
        this.i32 = make("i32", prg)
        this.i64 = make("i64", prg)
        this.f32 = make("f32", prg)
        this.f64 = make("f64", prg)
    }
}

function make<T extends WasmType>(type: T, prg: Program) {
    return (local: string, delta: InstrOrConst<T> = 1): Instruction<"void"> => {
        prg.$locals.add(local, type)
        return {
            type: "void",
            code: [
                `local.get $${local}`,
                prg.ensureInstr(delta, type),
                `${type}.add`,
                `local.set $${local}`,
            ],
        }
    }
}
