import Program from ".."
import { InstrType, Instruction, WasmType } from "../../types"

export default class Log {
    constructor(private readonly prg: Program) {}

    local(name: string): Instruction<"void"> {
        const type = this.prg.$locals.get(name)
        const text = `Local $${name} (${type}) ==`
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
