import { WasmType } from "../../../types"

export function maxType(code: string, t1: WasmType, t2: WasmType): WasmType {
    switch (code) {
        case "add":
        case "div":
        case "mul":
        case "sub":
        case "lt":
        case "gt":
        case "le":
        case "ge":
            return maxTypeStandard(t1, t2)
        case "and":
        case "or":
        case "xor":
            return maxTypeInteger(t1, t2)
        default:
            throw Error(
                `Don't know how to find maxType for operation "${code}"!`
            )
    }
}

function maxTypeStandard(t1: WasmType, t2: WasmType): WasmType {
    if (t1 === "bool" && t2 === "bool") return "bool"

    const [t1Char, t1Num] = splitType(t1)
    const [t2Char, t2Num] = splitType(t2)
    const char = t1Char === "f" || t2Char === "f" ? "f" : "i"
    return `${char}${Math.max(t1Num, t2Num)}` as WasmType
}

function maxTypeInteger(t1: WasmType, t2: WasmType): WasmType {
    if (t1 === "bool" && t2 === "bool") return "i32"

    const [t1Char, t1Num] = splitType(t1)
    const [t2Char, t2Num] = splitType(t2)
    return `i${Math.max(t1Num, t2Num)}` as WasmType
}

function splitType(type: string): [string, number] {
    if (type === "bool") type = "i32"
    return [type.charAt(0), parseInt(type.substring(1))]
}
