import { InstrCode, WasmType } from "../../../types"

export function generateConvert(
    code: InstrCode[],
    fromType: WasmType,
    toType: WasmType,
    alwaysPositive: boolean = false
) {
    if (fromType === "bool") fromType = "i32"
    if (toType === "bool") toType = "i32"
    if (fromType === toType) return

    const sign = alwaysPositive ? "u" : "s"
    switch (fromType) {
        case "i32":
            switch (toType) {
                case "i64":
                    code.push(`i64.extend_i32_${sign}`)
                    return
                case "f32":
                    code.push(`f32.convert_i32_${sign}`)
                    return
                case "f64":
                    code.push(`f64.convert_i32_${sign}`)
                    return
            }
            return
        case "i64":
            switch (toType) {
                case "i32":
                    code.push(`i32.wrap_i64`)
                    return
                case "f32":
                    code.push(`f32.convert_i64_${sign}`)
                    return
                case "f64":
                    code.push(`f64.convert_i64_${sign}`)
                    return
            }
            return
        case "f32":
            switch (toType) {
                case "i32":
                    code.push(`i32.trunc_f32_${sign}`)
                    return
                case "i64":
                    code.push(`i64.trunc_f32_${sign}`)
                    return
                case "f64":
                    code.push(`f64.promote_f32`)
                    return
            }
            return
        case "f64":
            switch (toType) {
                case "i32":
                    code.push(`i32.trunc_f64_${sign}`)
                    return
                case "i64":
                    code.push(`i64.trunc_f64_${sign}`)
                    return
                case "f32":
                    code.push("f32.demote_f64")
                    return
            }
    }
}

export function generateConvertInteger(
    code: InstrCode[],
    fromType: WasmType,
    toType: WasmType,
    alwaysPositive: boolean = false
) {
    if (fromType === "bool") fromType = "i32"
    if (toType === "bool") toType = "i32"
    if (fromType === toType) return

    const sign = alwaysPositive ? "u" : "s"
    switch (fromType) {
        case "i32":
            switch (toType) {
                case "i64":
                    code.push(`i64.extend_i32_${sign}`)
                    return
                case "f64":
                    code.push(`i64.trunc_f64_${sign}`)
                    return
                case "f32":
                    code.push(`i32.trunc_f32_${sign}`)
            }
            return
        case "i64":
            switch (toType) {
                case "i32":
                    code.push(`i32.wrap_i32`)
                    return
                case "f32":
                    code.push(`i32.trunc_f32_${sign}`)
                    return
                case "f64":
                    code.push(`i64.trunc_f64_${sign}`)
                    return
            }
            return
        case "f32":
            switch (toType) {
                case "i32":
                    code.push(`i32.trunc_f64_${sign}`)
                    return
                case "i64":
                    code.push(`i64.trunc_f64_${sign}`)
                    return
                case "f32":
                    code.push(`i32.trunc_f32_${sign}`)
                    return
            }
            return
    }
}
