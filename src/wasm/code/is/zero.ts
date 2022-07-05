import Context from "../../context"
import {
    F32,
    F64,
    I32,
    I64,
    InstrF32,
    InstrF64,
    InstrI32,
    InstrI64,
} from "../../types"

export default {
    i32(a: InstrI32): InstrI32 {
        return (ctx: Context) => {
            ctx.push(a, "i32.eqz")
            return I32
        }
    },
    i64(a: InstrI64): InstrI64 {
        return (ctx: Context) => {
            ctx.push(a, "i64.eqz")
            return I64
        }
    },
}
