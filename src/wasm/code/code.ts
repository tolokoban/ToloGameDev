import Add from "./add"
import Const from "./const"
import Context from "../context"
import Get from "./get"
import Is from "./is"
import Mul from "./mul"
import Param from "./param"
import Set from "./set"
import Sub from "./sub"
import {
    F32,
    F64,
    I32,
    I64,
    VOID,
    BOOL,
    InstrVoid,
    InstrI32,
    InstrI64,
    InstrF32,
    InstrF64,
    InstrBool,
} from "../types"

/**
 * https://developer.mozilla.org/en-US/docs/webassembly/reference/numeric/remainder
 * https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md#integer-arithmetic-instructions
 */
export default {
    add: Add,
    sub: Sub,
    mul: Mul,
    const: Const,
    get: Get,
    set: Set,
    param: Param,
    is: Is

    declareLocals(): InstrVoid {
        return (ctx: Context) => {
            for (const [name, type] of ctx.getLocals()) {
                ctx.push(`(local $${name} ${type})`)
            }
            return VOID
        }
    },

    bloc(...instructions: InstrVoid[]): InstrVoid {
        return (ctx: Context) => {
            for (const instr of instructions) instr(ctx)
            return VOID
        }
    },

    poke_i32(offset: InstrI32, value: InstrI32): InstrVoid {
        return (ctx: Context) => {
            ctx.push(offset, value, "i32.store")
            return VOID
        }
    },

    mod_i32(a: InstrI32, b: InstrI32): InstrI32 {
        return (ctx: Context) => {
            ctx.push(a, b, "i32.rem_u")
            return I32
        }
    },

    /**
     * Unsigned less than.
     */
    lessThan_ui32(a: InstrI32, b: InstrI32): InstrBool {
        return (ctx: Context) => {
            ctx.push(a, b, "i32.lt_u")
            return BOOL
        }
    },

    /**
     * Signed less than.
     */
    lessThan_si32(a: InstrI32, b: InstrI32): InstrBool {
        return (ctx: Context) => {
            ctx.push(a, b, "i32.lt_s")
            return BOOL
        }
    },

    branch(blockName: string, condition?: InstrBool): InstrVoid {
        if (!condition) {
            return (ctx: Context) => {
                ctx.push(`br $${blockName}`)
                return VOID
            }
        }
        return (ctx: Context) => {
            ctx.push(condition, `br_if $${blockName}`)
            return VOID
        }
    },

    /**
     * Repeat a set of instructions until the local reaches zero.
     * @param local Name of the local (i32) that owns the number of repetitions.
     * @param instructions Instructions to loop on.
     */
    repeat(local: string, ...instructions: InstrVoid[]): InstrVoid {
        return (ctx: Context) => {
            const blockName = ctx.getNextId("block")
            const localName = ctx.declareLocal_i32(local)
            ctx.push(`(block $${blockName}`, [Code.get_i32(localName)], ")")
            return VOID
        }
    },
}
