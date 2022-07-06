import {
    Code,
    F32,
    F64,
    I32,
    I64,
    InstrF32,
    InstrF64,
    InstrI32,
    InstrI64,
} from "../types"
import { makeInstr } from "../deps"

export default class SetAndGet {
    i32(name: string, value: InstrI32): InstrI32 {
        const fullname = `${name}_i32`
        return makeInstr(
            (code: Code) => {
                code.push(value, `local.tee $${fullname}`)
                return I32
            },
            {
                local: {
                    i32: [fullname],
                },
            },
            value.deps
        )
    }
    i64(name: string, value: InstrI64): InstrI64 {
        const fullname = `${name}_i64`
        return makeInstr(
            (code: Code) => {
                code.push(value, `local.tee $${fullname}`)
                return I64
            },
            {
                local: {
                    i64: [fullname],
                },
            },
            value.deps
        )
    }
    f32(name: string, value: InstrF32): InstrF32 {
        const fullname = `${name}_f32`
        return makeInstr(
            (code: Code) => {
                code.push(value, `local.tee $${fullname}`)
                return F32
            },
            {
                local: {
                    f32: [fullname],
                },
            },
            value.deps
        )
    }
    f64(name: string, value: InstrF64): InstrF64 {
        const fullname = `${name}_f64`
        return makeInstr(
            (code: Code) => {
                code.push(value, `local.tee $${fullname}`)
                return F64
            },
            {
                local: {
                    f64: [fullname],
                },
            },
            value.deps
        )
    }
}
