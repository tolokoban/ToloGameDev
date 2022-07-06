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

export default class Get {
    i32(name: string): InstrI32 {
        const fullname = `${name}_i32`
        return {
            exec(code: Code) {
                code.push(`local.get $${fullname}`)
                return I32
            },
            deps: {
                local: {
                    i32: [fullname],
                },
            },
        }
    }
    i64(name: string): InstrI64 {
        const fullname = `${name}_i64`
        return {
            exec(code: Code) {
                code.push(`local.get $${fullname}`)
                return I64
            },
            deps: {
                local: {
                    i64: [fullname],
                },
            },
        }
    }
    f32(name: string): InstrF32 {
        const fullname = `${name}_f32`
        return {
            exec(code: Code) {
                code.push(`local.get $${fullname}`)
                return F32
            },
            deps: {
                local: {
                    f32: [fullname],
                },
            },
        }
    }
    f64(name: string): InstrF64 {
        const fullname = `${name}_f64`
        return {
            exec(code: Code) {
                code.push(`local.get $${fullname}`)
                return F64
            },
            deps: {
                local: {
                    f64: [fullname],
                },
            },
        }
    }
}
