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

export type InstrOrConst<T extends WasmType> = Instruction<T> | number | string

export interface Instruction<T extends InstrType> {
    type: T
    code: InstrCode
    /** Function to call before stringification of this item */
    before?: () => void
    /** Function to call after stringification of this item */
    after?: () => void
}

export type WasmType = "i32" | "i64" | "f32" | "f64" | "bool"

export type MemoryArray = Uint8ClampedArray | Float32Array | Int32Array

export interface ProgramOptionsMemory {
    [bufferName: string]: MemoryArray
}

export interface ProgramOptions {
    memory?: ProgramOptionsMemory
}

export interface PartialProgramOptions {
    memory?: { [bufferName: string]: MemoryArray }
}

export type ProgramMainFunction<
    IN extends number[] = [],
    OUT extends void | number = void
> = (...args: IN) => OUT

export interface MapOf<T> {
    [key: string]: T
}

export interface ProgramBuildMemory {
    [name: string]: MemoryArray
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
    params: { [name: string]: WasmType }
    /**
     * If `true` this function is exported.
     * A function called "main" is always exported.
     */
    export: boolean
    type: InstrType
}
