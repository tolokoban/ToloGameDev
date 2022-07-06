export type InstrType =
    | "i32"
    | "i64"
    | "f32"
    | "f64"
    | "void"
    | "bool"
    | "func"
    | "module"

export type InstrCode =
    | string
    | Instruction<InstrType>
    | (() => InstrCode)
    | InstrCode[]

export interface Instruction<T extends InstrType> {
    type: T
    code: InstrCode
}

export type LocalType = "i32" | "i64" | "f32" | "f64"
