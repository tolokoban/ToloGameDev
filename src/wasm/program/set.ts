import { InstrVoid, VOID } from "./../types"
import { Code, InstrF32, InstrF64, InstrI32, InstrI64 } from "../types"
import { makeInstr } from "../deps"
import Program from "."

export default class Set {
    constructor(private readonly prg: Program) {}

    i32(name: string, value: InstrI32 | number = 0): InstrVoid {
        const realValue =
            typeof value === "number" ? this.prg.const.i32(value) : value
        const fullname = `${name}_i32`
        return makeInstr(
            (code: Code) => {
                code.push(realValue, `local.set $${fullname}`)
                return VOID
            },
            {
                local: {
                    i32: [fullname],
                },
            },
            realValue.deps
        )
    }
    i64(name: string, value: InstrI64 | number = 0): InstrVoid {
        const realValue =
            typeof value === "number" ? this.prg.const.i64(value) : value
        const fullname = `${name}_i64`
        return makeInstr(
            (code: Code) => {
                code.push(realValue, `local.set $${fullname}`)
                return VOID
            },
            {
                local: {
                    i64: [fullname],
                },
            },
            realValue.deps
        )
    }
    f32(name: string, value: InstrF32 | number = 0): InstrVoid {
        const realValue =
            typeof value === "number" ? this.prg.const.f32(value) : value
        const fullname = `${name}_f32`
        return makeInstr(
            (code: Code) => {
                code.push(realValue, `local.set $${fullname}`)
                return VOID
            },
            {
                local: {
                    f32: [fullname],
                },
            },
            realValue.deps
        )
    }
    f64(name: string, value: InstrF64 | number = 0): InstrVoid {
        const realValue =
            typeof value === "number" ? this.prg.const.f64(value) : value
        const fullname = `${name}_f64`
        return makeInstr(
            (code: Code) => {
                code.push(realValue, `local.set $${fullname}`)
                return VOID
            },
            {
                local: {
                    f64: [fullname],
                },
            },
            realValue.deps
        )
    }
}
