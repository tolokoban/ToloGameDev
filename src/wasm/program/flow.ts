import Program from "."
import { makeInstr, mergeDeps } from "../deps"
import {
    Code,
    FUNC,
    I32,
    InstrBool,
    InstrFunc,
    InstrI32,
    InstrVoid,
    VOID,
    MODULE,
    Dependencies,
} from "../types"

type ParamType = "i32" | "i64" | "f32" | "f64"

export default class Flow {
    constructor(private readonly prg: Program) {}

    module(...functions: InstrFunc[]) {
        return makeInstr((code: Code): typeof MODULE => {
            code.push(
                "(module",
                [
                    '(import "env" "buffer" (memory 1))',
                    ...functions,
                    '(export "main" (func $main))',
                ],
                ")"
            )
            return MODULE
        })
    }

    readonly func = {
        void(
            name: string,
            params: { [name: string]: ParamType },
            ...instructions: InstrVoid[]
        ): InstrFunc {
            return makeInstr((code: Code) => {
                const paramsCode = Object.keys(params).map(
                    (paramName) => `(param $${paramName} ${params[paramName]})`
                )
                const deps = mergeDeps(...instructions.map((f) => f.deps))
                const localsCode: string[] = makeLocalsCode(deps)
                code.push(
                    `(func $${name} ${paramsCode.join(" ")}`,
                    localsCode.join(" "),
                    instructions,
                    ")"
                )
                return FUNC
            })
        },
        i32(
            name: string,
            params: { [name: string]: ParamType },
            ...instructions: [...block: InstrVoid[], result: InstrI32]
        ): InstrFunc {
            return makeInstr((code: Code) => {
                const paramsCode = Object.keys(params).map(
                    (paramName) => `(param $${paramName} ${params[paramName]})`
                )
                const deps = mergeDeps(...instructions.map((f) => f.deps))
                const localsCode: string[] = makeLocalsCode(deps)
                code.push(
                    `(func $${name} ${paramsCode.join(" ")} (result i32)`,
                    localsCode.join(" "),
                    instructions,
                    ")"
                )
                return FUNC
            })
        },
    }

    branch(blockName: string, condition?: InstrBool): InstrVoid {
        if (!condition) {
            return makeInstr((code: Code) => {
                code.push(`br $${blockName}`)
                return VOID
            })
        }
        return makeInstr((code: Code) => {
            code.push(condition, `br_if $${blockName}`)
            return VOID
        }, condition.deps)
    }

    /**
     * Repeat a set of instructions until the local reaches zero.
     * The local will go from the current value to 1.
     * @param local Name of the local (i32) that owns the number of repetitions.
     * @param instructions Instructions to loop on.
     */
    repeat(local: string, ...instructions: InstrVoid[]): InstrVoid {
        return makeInstr(
            (code: Code) => {
                const blockName = this.prg.$makeId("block")
                code.push(
                    `(block $${blockName}`,
                    [
                        this.branch(
                            blockName,
                            this.prg.is.positive.i32(this.prg.get.i32(local))
                        ),
                        ...instructions,
                        this.prg.dec.i32(local),
                    ],
                    ")"
                )
                return VOID
            },
            ...instructions.map((x) => x.deps),
            { local: { i32: [local] } }
        )
    }
}

function makeLocalsCode(deps: Dependencies) {
    const localsCode: string[] = []
    if (deps.local) {
        if (deps.local.i32)
            localsCode.push(...deps.local.i32.map((n) => `(local ${n} i32)`))
        if (deps.local.i64)
            localsCode.push(...deps.local.i64.map((n) => `(local ${n} i64)`))
        if (deps.local.f32)
            localsCode.push(...deps.local.f32.map((n) => `(local ${n} f32)`))
        if (deps.local.f64)
            localsCode.push(...deps.local.f64.map((n) => `(local ${n} f64)`))
    }
    return localsCode
}
