import Program from "."
import { Instruction } from "./../types"
import { LocalType } from "../types"

export default class Declare {
    constructor(private readonly prg: Program) {}

    params(params: { [name: string]: LocalType }): Instruction<"declaration"> {
        this.prg.$params.current = params
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
