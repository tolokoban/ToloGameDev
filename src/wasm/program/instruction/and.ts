import Program from ".."
import { InstrOrConst, Instruction, WasmType } from "../../types"

export default class Add {
    constructor(private readonly prg: Program) {}

    readonly i32 = make("i32", this.prg)
    readonly bool = make("bool", this.prg)
}

function make<T extends "bool" | "i32">(type: T, prg: Program) {
    return (...values: InstrOrConst<T>[]): Instruction<T> => {
        return {
            type,
            code: [
                ...values.map((a) => prg.ensureInstr(a, type)),
                ...repeat(values.length - 1, `i32.and`),
            ],
        }
    }
}

function repeat(count: number, line: string): string[] {
    const out: string[] = []
    for (let i = 0; i < count; i++) out.push(line)
    return out
}
