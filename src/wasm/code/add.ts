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
    i32(a: InstrI32, b: InstrI32): InstrI32 {
        return (ctx: Context) => {
            ctx.push(a, b, "i32.add")
            return I32
        }
    },
    i64(a: InstrI64, b: InstrI64): InstrI64 {
        return (ctx: Context) => {
            ctx.push(a, b, "i64.add")
            return I64
        }
    },
    f32(a: InstrI32, b: InstrF32): InstrF32 {
        return (ctx: Context) => {
            ctx.push(a, b, "f32.add")
            return F32
        }
    },
    f64(a: InstrF64, b: InstrF64): InstrF64 {
        return (ctx: Context) => {
            ctx.push(a, b, "f64.add")
            return F64
        }
    },
}
