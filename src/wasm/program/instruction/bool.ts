import { InstrCode, Instruction } from "../../types"

export default class Bool {
    readonly and = make("and")
    readonly or = make("or")
    readonly xor = make("xor")
}

function make(operation: "or" | "and" | "xor") {
    return (cases: [Instruction<"bool">, ...Instruction<"bool">[]]) => {
        const code: InstrCode = [...cases]
        for (let i = 0; i < cases.length - 1; i++) {
            code.push(`i32.${operation}`)
        }
        return { type: "bool", code }
    }
}
