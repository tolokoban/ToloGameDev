export type InstrType =
    | "i32"
    | "i64"
    | "f32"
    | "f64"
    | "void"
    | "bool"
    | "func"
    | "module"

export type InstrCode = string | Instruction<InstrType> | InstrCode[]

export interface Instruction<T extends InstrType> {
    type: T
    code: InstrCode
    /** Function to call before stringification of this item */
    before?: () => void
    /** Function to call after stringification of this item */
    after?: () => void
}

export type LocalType = "i32" | "i64" | "f32" | "f64" | "bool"
