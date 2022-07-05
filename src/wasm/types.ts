import Context from "./context"

export const VOID = 0
export const I32 = 1
export const I64 = 2
export const F32 = 3
export const F64 = 4
export const BOOL = 5

export type InstrVoid = (ctx: Context) => typeof VOID
export type InstrI32 = (ctx: Context) => typeof I32
export type InstrI64 = (ctx: Context) => typeof I64
export type InstrF32 = (ctx: Context) => typeof F32
export type InstrF64 = (ctx: Context) => typeof F64
export type InstrBool = (ctx: Context) => typeof BOOL
