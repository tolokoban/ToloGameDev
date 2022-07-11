import { InstrCode, InstrType, Instruction } from "../types"

export default class If {
    readonly void = make("void")
    readonly bool = make("bool")
    readonly i32 = make("i32")
    readonly i64 = make("i64")
    readonly f32 = make("f32")
    readonly f64 = make("f64")
}

function make<T extends InstrType>(type: T) {
    return (
        condition: Instruction<"bool">,
        thenBloc: [...Instruction<"void">[], Instruction<T>],
        elseBloc?: [...Instruction<"void">[], Instruction<T>]
    ): Instruction<T> => {
        const code: InstrCode = [condition, "(if", "(then", ...thenBloc, ")"]
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
