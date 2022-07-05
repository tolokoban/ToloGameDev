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
    i32(name: string): InstrI32 {
        return (ctx: Context) => {
            ctx.push(`local.get $${ctx.declareLocal_i32(name)}`)
            return I32
        }
    },

    i64(name: string): InstrI64 {
        return (ctx: Context) => {
            ctx.push(`local.get $${ctx.declareLocal_i64(name)}`)
            return I64
        }
    },

    f32(name: string): InstrF32 {
        return (ctx: Context) => {
            ctx.push(`local.get $${ctx.declareLocal_f32(name)}`)
            return F32
        }
    },

    f64(name: string): InstrF64 {
        return (ctx: Context) => {
            ctx.push(`local.get $${ctx.declareLocal_f64(name)}`)
            return F64
        }
    },
}
