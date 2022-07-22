import Program from ".."
import { InstrType, Instruction, WasmType } from "../../types"

/**
 * Call a function.
 */
export default class Call {
    constructor(private readonly prg: Program) {}

    readonly void = make("void", this.prg)
    readonly bool = make("bool", this.prg)
    readonly i32 = make("i32", this.prg)
    readonly i64 = make("i64", this.prg)
    readonly f32 = make("f32", this.prg)
    readonly f64 = make("f64", this.prg)
}

function make<T extends WasmType | "void">(type: T, prg: Program) {
    return (
        funcName: string,
        ...params: Instruction<WasmType>[]
    ): Instruction<T> => {
        const item = prg.$functions.get(funcName)
        if (item.type !== type) {
            throw Error(
                `Function "${funcName}" returns "${item.type}" and not "${type}"!`
            )
        }
        const paramNames = Object.keys(item.params)
        if (params.length !== paramNames.length) {
            throw Error(
                `Function "${funcName}" expects ${paramNames.length} params and not ${params.length}!`
            )
        }
        for (let index = 0; index < paramNames.length; index++) {
            const instr = params[index]
            const paramName = paramNames[index]
            const expectedType = item.params[paramName]
            const givenType = instr.type
            if (givenType !== expectedType) {
                throw Error(
                    `Param "${paramName}" of function "${funcName}" must be of type "${expectedType}" and not "${givenType}"!`
                )
            }
        }
        return {
            type,
            code: [`;; Call ${funcName}()`, ...params, `call $${funcName}`],
        }
    }
}
