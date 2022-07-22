import Program from ".."
import { Instruction, WasmType } from "../../types"

export default class Declare {
    constructor(private readonly prg: Program) {}

    params(
        params: { [name: string]: WasmType } = {}
    ): Instruction<"declaration"> {
        this.prg.$params.current = params
        this.prg.$locals.clear()
        return {
            type: "declaration",
            code: Object.entries(params)
                .map(
                    ([paramName, paramType]) =>
                        `(param $${paramName} ${paramType})`
                )
                .join(" "),
        }
    }
}
