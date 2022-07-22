import Program from ".."
import { InstrOrConst, Instruction, WasmType } from "../../types"

type PokeFunc<T extends WasmType> = (
    index: InstrOrConst<"i32">,
    value: InstrOrConst<T>,
    memoryName?: string
) => Instruction<"void">

export default class Poke {
    readonly i32: PokeFunc<"i32">
    readonly i32For8: PokeFunc<"i32">
    readonly i32For16: PokeFunc<"i32">
    readonly i64: PokeFunc<"i64">
    readonly i64For8: PokeFunc<"i64">
    readonly i64For16: PokeFunc<"i64">
    readonly i64For32: PokeFunc<"i64">
    readonly f32: PokeFunc<"f32">
    readonly f64: PokeFunc<"f64">

    constructor(prg: Program) {
        this.i32 = make("i32", prg)
        this.i32For8 = make("i32", prg, "8")
        this.i32For16 = make("i32", prg, "16")
        this.i64 = make("i64", prg)
        this.i64For8 = make("i64", prg, "8")
        this.i64For16 = make("i64", prg, "16")
        this.i64For32 = make("i64", prg, "32")
        this.f32 = make("f32", prg)
        this.f64 = make("f64", prg)
    }
}

function make<T extends WasmType>(
    type: T,
    prg: Program,
    extension: string = ""
): PokeFunc<T> {
    return (
        index: InstrOrConst<"i32">,
        value: InstrOrConst<T>,
        memoryName?: string
    ): Instruction<"void"> => {
        return {
            type: "void",
            code: [
                computeOffset(prg, index, memoryName),
                prg.ensureInstr(value, type),
                `${type}.store${extension}`,
            ],
        }
    }
}

function computeOffset(
    prg: Program,
    index: InstrOrConst<"i32">,
    memoryName: string | undefined
): Instruction<"i32"> {
    const pos = applyBPE(prg, prg.ensureInstr(index, "i32"), memoryName)
    const offset = prg.$memory.offset(memoryName)
    if (offset === 0) return pos

    return prg.add.i32(offset, pos)
}

function applyBPE(
    prg: Program,
    index: Instruction<"i32">,
    memoryName?: string
) {
    const bpe = prg.$memory.bpe(memoryName)
    switch (bpe) {
        case 1:
            // No stride.
            return index
        case 2:
            return prg.shl.i32(index, "1")
        case 4:
            return prg.shl.i32(index, "2")
        case 8:
            return prg.shl.i32(index, "3")
        default:
            return prg.mul.i32(bpe, index)
    }
}
