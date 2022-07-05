import Context from "../context"
import {
    F32,
    F64,
    I32,
    I64,
    InstrF32,
    InstrF64,
    InstrI32,
    InstrI64,
} from "../types"

export default {
    i32(value: number): InstrI32 {
        return (ctx: Context) => {
            ctx.push(`i32.const ${value}`)
            return I32
        }
    },

    i64(value: number): InstrI64 {
        return (ctx: Context) => {
            ctx.push(`i64.const ${value}`)
            return I64
        }
    },

    f32(value: number): InstrF32 {
        return (ctx: Context) => {
            ctx.push(`f32.const ${value}`)
            return F32
        }
    },

    f64(value: number): InstrF64 {
        return (ctx: Context) => {
            ctx.push(`f64.const ${value}`)
            return F64
        }
    },
}
