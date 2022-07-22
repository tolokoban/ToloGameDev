import Program from ".."
import { InstrOrConst, Instruction, WasmType } from "../../types"

export default class Add {
    constructor(private readonly prg: Program) {}

    readonly i32 = make("i32", this.prg)
    readonly i64 = make("i64", this.prg)
    readonly f32 = make("f32", this.prg)
    readonly f64 = make("f64", this.prg)
}

function make<T extends WasmType>(type: T, prg: Program) {
    return (...values: InstrOrConst<T>[]): Instruction<T> => {
        return {
            type,
            code: [
                ...values.map((a) => prg.ensureInstr(a, type)),
                ...repeat(values.length - 1, `${type}.add`),
            ],
        }
    }
}

function repeat(count: number, line: string): string[] {
    const out: string[] = []
    for (let i = 0; i < count; i++) out.push(line)
    return out
}
