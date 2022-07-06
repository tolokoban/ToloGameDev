import { makeInstr } from "../deps"
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

export default class Params {
    i32(name: string): InstrI32 {
        return makeInstr((code: Code) => {
            code.push(`local.get $${name}`)
            return I32
        })
    }

    i64(name: string): InstrI64 {
        return makeInstr((code: Code) => {
            code.push(`local.get $${name}`)
            return I64
        })
    }

    f32(name: string): InstrF32 {
        return makeInstr((code: Code) => {
            code.push(`local.get $${name}`)
            return F32
        })
    }

    f64(name: string): InstrF64 {
        return makeInstr((code: Code) => {
            code.push(`local.get $${name}`)
            return F64
        })
    }
}
