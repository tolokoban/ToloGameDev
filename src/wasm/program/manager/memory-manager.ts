import { MemoryArray, ProgramBuildMemory, WasmType } from "../../types"

interface MemoryItem {
    data: MemoryArray
    offset: number
    /** Wasm type: i32, i64, f32, f64, ... */
    type: WasmType
    /** Is always positive? */
    alwaysPositive: boolean
    /** Bytes per element */
    bpe: number
    /**
     * Reading an element of a Uint8Array is done with a i32 type
     * and this wasm instruction: `i32.load8_u`. So, in this case,
     * the extension will be "8_u".
     */
    extension: string
}

export default class MemoryManager {
    public readonly sizeInBytes: number
    public readonly sizeInPages: number
    public readonly wasmMemory: WebAssembly.Memory

    private readonly memoryItems = new Map<string, MemoryItem>()
    private readonly nameOfFirstMemoryBank: string

    constructor(memory: { [bufferName: string]: MemoryArray } = {}) {
        this.nameOfFirstMemoryBank = Object.keys(memory)[0] ?? ""
        let offset = 0
        for (const bufferName of Object.keys(memory)) {
            const data = memory[bufferName]
            try {
                this.memoryItems.set(bufferName, {
                    data,
                    offset,
                    type: figureOutType(data),
                    alwaysPositive: figureOutIfIsAlwaysPositive(data),
                    bpe: data.BYTES_PER_ELEMENT,
                    extension: figureOutExtension(data),
                })
                offset += data.byteLength
            } catch (ex) {
                console.error(data)
                throw Error(
                    `Unable to parse memory bank "${bufferName}":\n${ex}`
                )
            }
        }
        this.sizeInBytes = offset
        this.sizeInPages = Math.ceil(offset / 0x10000)
        const wasmMemory = new WebAssembly.Memory({
            initial: this.sizeInPages,
            maximum: this.sizeInPages,
        })
        const { buffer } = wasmMemory
        for (const { data, offset } of this.memoryItems.values()) {
            const array: MemoryArray = makeArray(buffer, offset, data)
            array.set(data)
        }
        this.wasmMemory = wasmMemory
    }

    /**
     * @returns Views on the Wasm buffer.
     */
    export(): ProgramBuildMemory {
        const output: ProgramBuildMemory = {}
        const { buffer } = this.wasmMemory
        const { memoryItems } = this
        for (const name of memoryItems.keys()) {
            const item = memoryItems.get(name)
            if (!item)
                throw Error(
                    `Impossible error!\nCan't find memory bank "${name}".`
                )
            const { data, offset } = item
            output[name] = makeArray(buffer, offset, data)
        }
        return output
    }

    /**
     * @returns The offset of a given memory bank.
     */
    offset(name?: string): number {
        return this.find(name).offset
    }

    /**
     * @returns The Wasm type of a given memory bank.
     */
    type(name?: string): WasmType {
        return this.find(name).type
    }

    /**
     * @returns An extension to the `i32.load` function.
     * Can be "", "8_u", "8_s", "16_u", ...
     */
    extension(name?: string): string {
        return this.find(name).extension
    }

    /**
     * @returns If the values are all positive?
     */
    isAlwaysPositive(name?: string): boolean {
        return this.find(name).alwaysPositive
    }

    /**
     * @returns The number of bytes per element.
     */
    bpe(name?: string): number {
        return this.find(name).bpe
    }

    private find(name?: string): MemoryItem {
        if (typeof name !== "string" || name.length === 0) {
            name = this.nameOfFirstMemoryBank
        }
        const item = this.memoryItems.get(name)
        if (item) return item

        this.throwUnknownMemoryNameError(name)
    }

    private throwUnknownMemoryNameError(name: string): never {
        const availableNames = Array.of(this.memoryItems.keys())
        if (availableNames.length === 0) {
            throw Error(
                `You asked for memory bank "${name}",\nbut no memory has been defined for this program!`
            )
        }
        throw Error(
            `There is no memory bank named "${name}"!\nPossible names are: ${availableNames
                .map((n) => `"n"`)
                .join(", ")}.`
        )
    }
}

function makeArray(
    buffer: ArrayBuffer,
    offset: number,
    data: MemoryArray
): MemoryArray {
    if (data instanceof Float32Array)
        return new Float32Array(buffer, offset, data.length)
    if (data instanceof Uint8ClampedArray)
        return new Uint8ClampedArray(buffer, offset, data.length)
    if (data instanceof Int32Array)
        return new Int32Array(buffer, offset, data.length)
    console.error("Unknown array type:", data)
    throw Error(`Unknown array type!`)
}

function figureOutType(data: MemoryArray): WasmType {
    if (data instanceof Float32Array) return "f32"
    if (data instanceof Uint8ClampedArray) return "i32"
    if (data instanceof Int32Array) return "i32"
    console.error("Unknown array type:", data)
    throw Error(`Unknown array type!`)
}

function figureOutIfIsAlwaysPositive(data: MemoryArray): boolean {
    if (data instanceof Float32Array) return false
    if (data instanceof Uint8ClampedArray) return true
    if (data instanceof Int32Array) return true
    console.error("Unknown array type:", data)
    throw Error(`Unknown array type!`)
}

function figureOutExtension(data: MemoryArray): string {
    if (data instanceof Float32Array) return ""
    if (data instanceof Uint8ClampedArray) return "8_u"
    if (data instanceof Int32Array) return ""
    console.error("Unknown array type:", data)
    throw Error(`Unknown array type!`)
}
