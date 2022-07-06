import { InstrType, Instruction } from "../types"

export default class DecAndGet {
    readonly i32 = make("i32")
    readonly i64 = make("i64")
    readonly f32 = make("f32")
    readonly f64 = make("f64")
}

function make<T extends InstrType>(type: T) {
    return (local: string, delta: InstrI32 | number = 1): Instruction<T> => {
        const value =
            typeof delta === "number" ? `${type}.const ${delta}` : delta
        return {
            type,
            code: [a, b, `${type}.add`],
        }
    }
}

import Program from "."
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

/**
 * Decrement a local.
 */
export default class Dec {
    constructor(private readonly prg: Program) {}

    i32(local: string, delta: InstrI32 | number = 1): InstrI32 {
        if (typeof delta === "number") {
            return makeInstr(
                (code: Code) => {
                    code.push(
                        this.prg.setAndGet.i32(
                            local,
                            this.prg.sub.i32(
                                this.prg.get.i32(local),
                                this.prg.const.i32(delta)
                            )
                        )
                    )
                    return I32
                },
                { local: { i32: [local] } }
            )
        }
        return makeInstr(
            (code: Code) => {
                code.push(
                    this.prg.setAndGet.i32(
                        local,
                        this.prg.sub.i32(this.prg.get.i32(local), delta)
                    )
                )
                return I32
            },
            delta.deps,
            { local: { i32: [local] } }
        )
    }
    i64(local: string, delta: InstrI64 | number = 1): InstrI64 {
        if (typeof delta === "number") {
            return makeInstr(
                (code: Code) => {
                    code.push(
                        this.prg.setAndGet.i64(
                            local,
                            this.prg.sub.i64(
                                this.prg.get.i64(local),
                                this.prg.const.i64(delta)
                            )
                        )
                    )
                    return I64
                },
                { local: { i64: [local] } }
            )
        }
        return makeInstr(
            (code: Code) => {
                code.push(
                    this.prg.setAndGet.i64(
                        local,
                        this.prg.sub.i64(this.prg.get.i64(local), delta)
                    )
                )
                return I64
            },
            delta.deps,
            { local: { i64: [local] } }
        )
    }
    f32(local: string, delta: InstrF32 | number = 1): InstrF32 {
        if (typeof delta === "number") {
            return makeInstr(
                (code: Code) => {
                    code.push(
                        this.prg.setAndGet.f32(
                            local,
                            this.prg.sub.f32(
                                this.prg.get.f32(local),
                                this.prg.const.f32(delta)
                            )
                        )
                    )
                    return F32
                },
                { local: { f32: [local] } }
            )
        }
        return makeInstr(
            (code: Code) => {
                code.push(
                    this.prg.setAndGet.f32(
                        local,
                        this.prg.sub.f32(this.prg.get.f32(local), delta)
                    )
                )
                return F32
            },
            delta.deps,
            { local: { f32: [local] } }
        )
    }
    f64(local: string, delta: InstrF64 | number = 1): InstrF64 {
        if (typeof delta === "number") {
            return makeInstr(
                (code: Code) => {
                    code.push(
                        this.prg.setAndGet.f64(
                            local,
                            this.prg.sub.f64(
                                this.prg.get.f64(local),
                                this.prg.const.f64(delta)
                            )
                        )
                    )
                    return F64
                },
                { local: { f64: [local] } }
            )
        }
        return makeInstr(
            (code: Code) => {
                code.push(
                    this.prg.setAndGet.f64(
                        local,
                        this.prg.sub.f64(this.prg.get.f64(local), delta)
                    )
                )
                return F64
            },
            delta.deps,
            { local: { f64: [local] } }
        )
    }
}
