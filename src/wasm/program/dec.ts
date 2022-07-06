import Program from "."
import { makeInstr } from "../deps"
import {
    Code,
    InstrF32,
    InstrF64,
    InstrI32,
    InstrI64,
    InstrVoid,
    VOID,
} from "../types"

/**
 * Decrement a local.
 */
export default class Dec {
    constructor(private readonly prg: Program) {}

    i32(local: string, delta: InstrI32 | number = 1): InstrVoid {
        if (typeof delta === "number") {
            return makeInstr(
                (code: Code) => {
                    code.push(
                        this.prg.set.i32(
                            local,
                            this.prg.sub.i32(
                                this.prg.get.i32(local),
                                this.prg.const.i32(delta)
                            )
                        )
                    )
                    return VOID
                },
                { local: { i32: [local] } }
            )
        }
        return makeInstr(
            (code: Code) => {
                code.push(
                    this.prg.set.i32(
                        local,
                        this.prg.sub.i32(this.prg.get.i32(local), delta)
                    )
                )
                return VOID
            },
            delta.deps,
            { local: { i32: [local] } }
        )
    }
    i64(local: string, delta: InstrI64 | number = 1): InstrVoid {
        if (typeof delta === "number") {
            return makeInstr(
                (code: Code) => {
                    code.push(
                        this.prg.set.i64(
                            local,
                            this.prg.sub.i64(
                                this.prg.get.i64(local),
                                this.prg.const.i64(delta)
                            )
                        )
                    )
                    return VOID
                },
                { local: { i64: [local] } }
            )
        }
        return makeInstr(
            (code: Code) => {
                code.push(
                    this.prg.set.i64(
                        local,
                        this.prg.sub.i64(this.prg.get.i64(local), delta)
                    )
                )
                return VOID
            },
            delta.deps,
            { local: { i64: [local] } }
        )
    }
    f32(local: string, delta: InstrF32 | number = 1): InstrVoid {
        if (typeof delta === "number") {
            return makeInstr(
                (code: Code) => {
                    code.push(
                        this.prg.set.f32(
                            local,
                            this.prg.sub.f32(
                                this.prg.get.f32(local),
                                this.prg.const.f32(delta)
                            )
                        )
                    )
                    return VOID
                },
                { local: { f32: [local] } }
            )
        }
        return makeInstr(
            (code: Code) => {
                code.push(
                    this.prg.set.f32(
                        local,
                        this.prg.sub.f32(this.prg.get.f32(local), delta)
                    )
                )
                return VOID
            },
            delta.deps,
            { local: { f32: [local] } }
        )
    }
    f64(local: string, delta: InstrF64 | number = 1): InstrVoid {
        if (typeof delta === "number") {
            return makeInstr(
                (code: Code) => {
                    code.push(
                        this.prg.set.f64(
                            local,
                            this.prg.sub.f64(
                                this.prg.get.f64(local),
                                this.prg.const.f64(delta)
                            )
                        )
                    )
                    return VOID
                },
                { local: { f64: [local] } }
            )
        }
        return makeInstr(
            (code: Code) => {
                code.push(
                    this.prg.set.f64(
                        local,
                        this.prg.sub.f64(this.prg.get.f64(local), delta)
                    )
                )
                return VOID
            },
            delta.deps,
            { local: { f64: [local] } }
        )
    }
}
