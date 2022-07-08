import Program from "./program"
import { InstrType, Instruction, LocalType } from "../types"

export default class Log {
    constructor(private readonly prg: Program) {}

    local(name: string): Instruction<"void"> {
        const type = this.prg.$getLocalType(name)
        const text = `Local $${name}_${type} ==`
        const textId = this.prg.$addTextResource(text)
        return {
            type: "void",
            code: [
                `i32.const ${textId} ;; "${text}"`,
                `local.get $${name}_${type}`,
                `call $_log_${type}`,
            ],
        }
    }

    param(name: string): Instruction<"void"> {
        const type = this.prg.$params.get(name)
        const text = `Param $${name} (${type}) ==`
        const textId = this.prg.$addTextResource(text)
        return {
            type: "void",
            code: [
                `i32.const ${textId} ;; "${text}"`,
                `local.get $${name}`,
                `call $_log_${type}`,
            ],
        }
    }

    text(text: string): Instruction<"void"> {
        const textId = this.prg.$addTextResource(text)
        return {
            type: "void",
            code: [`i32.const ${textId} ;; "${text}"`, `call $_log_text`],
        }
    }
}
