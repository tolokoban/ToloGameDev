import Program from "."
import { InstrOrConst, Instruction, LocalType } from "../types"

export default class Mul {
    constructor(private readonly prg: Program) {}

    readonly i32 = make("i32", this.prg)
    readonly i64 = make("i64", this.prg)
    readonly f32 = make("f32", this.prg)
    readonly f64 = make("f64", this.prg)
}

function make<T extends LocalType>(type: T, prg: Program) {
    return (a: InstrOrConst<T>, b: InstrOrConst<T>): Instruction<T> => {
        return {
            type,
            code: [
                prg.ensureInstr(a, type),
                prg.ensureInstr(b, type),
                `${type}.sub`,
            ],
        }
    }
}
