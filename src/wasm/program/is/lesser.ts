import Program from ".."
import { InstrOrConst, Instruction, LocalType } from "../../types"

export default class Lesser {
    constructor(private readonly prg: Program) {}

    readonly ui32 = make("i32", this.prg, "_u")
    readonly ui64 = make("i64", this.prg, "_u")
    readonly si32 = make("i32", this.prg, "_s")
    readonly si64 = make("i64", this.prg, "_s")
    readonly f32 = make("f32", this.prg)
    readonly f64 = make("f64", this.prg)
}

function make<T extends LocalType>(
    type: T,
    prg: Program,
    extension: "" | "_u" | "_s" = ""
) {
    return (a: InstrOrConst<T>, b: InstrOrConst<T>): Instruction<"bool"> => {
        return {
            type: "bool",
            code: [
                prg.ensureInstr(a, type),
                prg.ensureInstr(b, type),
                `${type}.lt${extension}`,
            ],
        }
    }
}
