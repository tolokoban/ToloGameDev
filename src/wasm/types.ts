export type InstrType =
    | "i32"
    | "i64"
    | "f32"
    | "f64"
    | "void"
    | "bool"
    | "func"
    | "module"
    | "declaration"

export type InstrCode = string | Instruction<InstrType> | InstrCode[]

export type InstrOrConst<T extends LocalType> = Instruction<T> | number | string

export interface Instruction<T extends InstrType> {
    type: T
    code: InstrCode
    /** Function to call before stringification of this item */
    before?: () => void
    /** Function to call after stringification of this item */
    after?: () => void
}

export type LocalType = "i32" | "i64" | "f32" | "f64" | "bool"

export interface MemoryItem {
    type: "Uint8Clamped" | "Float32"
    data?: Uint8ClampedArray | Float32Array
    size: number
    cols: number
    rows: number
    offset: number
}

export interface ProgramOptionsMemory {
    [bufferName: string]: MemoryItem
}

export interface ProgramOptions {
    memory?: ProgramOptionsMemory
}

type Buffer<
    T extends "Uint8Clamped" | "Float32",
    D extends Uint8ClampedArray | Float32Array
> =
    | { type: T; data: D }
    | { type: T; size: number }
    | { type: T; cols: number; rows: number }

export interface PartialProgramOptions {
    memory?: {
        [bufferName: string]:
            | Buffer<"Uint8Clamped", Uint8ClampedArray>
            | Buffer<"Float32", Float32Array>
    }
}

export type ProgramMainFunction<
    IN extends number[] = [],
    OUT extends void | number = void
> = (...args: IN) => OUT

export interface MapOf<T> {
    [key: string]: T
}

export interface ProgramBuildMemory {
    Uint8Clamped: MapOf<Uint8ClampedArray>
    Float32: MapOf<Float32Array>
}

export interface ProgramBuild<
    IN extends number[] = [],
    OUT extends void | number = void
> {
    memory: ProgramBuildMemory
    main: ProgramMainFunction<IN, OUT>
    sourceCode: string
}

export interface FuncOptions {
    /** Default to "main" */
    name: string
    params: { [name: string]: LocalType }
    /**
     * If `true` this function is exported.
     * A function called "main" is always exported.
     */
    export: boolean
    type: InstrType
}
