import Program from "./program"
import {
    FuncOptions,
    InstrCode,
    InstrType,
    LocalType
    } from "./../types"
import { Instruction } from "../types"

export default class Flow {
    constructor(private readonly prg: Program) {}

    module(...functions: Instruction<"func">[]): Instruction<"module"> {
        const code: InstrCode = [
            "(module",
            '(import "log" "i32" (func $_log_i32 (param i32 i32)))',
            '(import "log" "i64" (func $_log_i64 (param i32 i64)))',
            '(import "log" "f32" (func $_log_f32 (param i32 f32)))',
            '(import "log" "f64" (func $_log_f64 (param i32 f64)))',
            '(import "log" "text" (func $_log_text (param i32)))',
        ]
        if (this.prg.$memory.enabled)
            code.push('(import "env" "mem" (memory 1))')
        code.push(...functions, ")")
        return {
            type: "module",
            code,
        }
    }

    readonly func = {
        void: makeFunc("void", this.prg),
        i32: makeFunc("i32", this.prg),
        i64: makeFunc("i64", this.prg),
        f32: makeFunc("f32", this.prg),
        f64: makeFunc("f64", this.prg),
    }

    branch(
        blockName: string,
        condition?: Instruction<"bool">
    ): Instruction<"void"> {
        if (!condition) {
            return { type: "void", code: `br $${blockName}` }
        }
        return { type: "void", code: [condition, `br_if $${blockName}`] }
    }

    /**
     * Repeat a set of instructions until the local reaches zero.
     * The local will go from the current value to 1.
     * @param local Name of the local (i32) that owns the number of repetitions.
     * @param instructions Instructions to loop on.
     */
    repeat(
        local: string,
        ...instructions: Instruction<"void">[]
    ): Instruction<"void"> {
        const { prg } = this
        const blockName = prg.$makeId("block")
        return {
            type: "void",
            code: [
                `(loop $${blockName}`,
                [
                    ...instructions,
                    prg.dec.i32(local),
                    this.branch(
                        blockName,
                        prg.is.positive.i32(prg.get.i32(local))
                    ),
                ],
                ")",
            ],
        }
    }
}

function makeFunc<T extends InstrType>(type: T, prg: Program) {
    return (
        options: Partial<FuncOptions>,
        params: Instruction<"declaration">,
        ...body: [...body: Instruction<"void">[], result: Instruction<T>]
    ): Instruction<"func"> => {
        const opts: FuncOptions = {
            name: "main",
            export: false,
            ...options,
            params: prg.$params.current,
            type,
        }
        prg.$functions.add(opts)
        if (opts.name === "main") opts.export = true
        const paramsCode = params.code
        return {
            type: "func",
            code: [
                `(func $${opts.name}${
                    opts.export ? ` (export "${opts.name}")` : ""
                } ${paramsCode} (result ${type})`,
                [prg.$getLocals(), ...body],
                ")",
            ],
        }
    }
}
