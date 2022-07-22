import Program from "../.."
import { InstrOrConst, InstrType, Instruction } from "../../../types"
import { WasmType } from "./../../../types"

export default class Greater {
    constructor(private readonly prg: Program) {}

    readonly ui32 = make(this.prg, "i32", "_u")
    readonly ui64 = make(this.prg, "i64", "_u")
    readonly si32 = make(this.prg, "i32", "_s")
    readonly si64 = make(this.prg, "i64", "_s")
    readonly f32 = make(this.prg, "f32")
    readonly f64 = make(this.prg, "f64")
}

function make<T extends WasmType>(
    prg: Program,
    type: T,
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
