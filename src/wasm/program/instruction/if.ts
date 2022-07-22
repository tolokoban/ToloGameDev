import Program from ".."
import {
    InstrCode,
    InstrOrConst,
    InstrType,
    Instruction
    } from "../../types"

export default class If {
    constructor(private readonly prg: Program) {}

    readonly void = make("void", this.prg)
    readonly bool = make("bool", this.prg)
    readonly i32 = make("i32", this.prg)
    readonly i64 = make("i64", this.prg)
    readonly f32 = make("f32", this.prg)
    readonly f64 = make("f64", this.prg)
}

function make<T extends InstrType>(type: T, prg: Program) {
    return (
        condition: InstrOrConst<"bool">,
        thenBloc: [...Instruction<"void">[], Instruction<T>],
        elseBloc?: [...Instruction<"void">[], Instruction<T>]
    ): Instruction<T> => {
        const code: InstrCode = [
            prg.ensureInstr(condition, "bool"),
            "(if",
            "(then",
            ...thenBloc,
            ")",
        ]
        if (elseBloc) {
            code.push("(else", ...elseBloc, ")")
        }
        code.push(")")
        return {
            type,
            code,
        }
    }
}
