import Program from ".."
import { InstrOrConst, Instruction, WasmType } from "../../types"

/**
 * Shift Left.
 */
export default class Shl {
    constructor(private readonly prg: Program) {}

    readonly i32 = make("i32", this.prg)
    readonly i64 = make("i64", this.prg)
}

function make<T extends WasmType>(type: T, prg: Program) {
    return (value: InstrOrConst<T>, by: InstrOrConst<T>): Instruction<T> => {
        return {
            type,
            code: [
                prg.ensureInstr(value, type),
                prg.ensureInstr(by, type),
                `${type}.shl`,
            ],
        }
    }
}
