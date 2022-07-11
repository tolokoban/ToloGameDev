import Program from ".."
import Scanner, { TreeNode } from "./scanner"
import { InstrCode, Instruction } from "./../../types"
import { LocalType } from "../../types"
import { parseTokens } from "./lexer"

export default class Calc {
    constructor(private readonly prg: Program) {}

    readonly i32 = make("i32", this.prg)
    readonly i64 = make("i64", this.prg)
    readonly f32 = make("f32", this.prg)
    readonly f64 = make("f64", this.prg)
}

function make<T extends LocalType>(type: T, prg: Program) {
    return (source: string): Instruction<T> => {
        const code: InstrCode[] = [`;; [Begin] Calc: ${source}`]
        const scanner = new Scanner(prg)
        const tree = scanner.buildTree(source)
        console.log("🚀 [calc] tree = ", tree) // @FIXME: Remove this line written on 2022-07-11 at 14:14
        generateCode(code, tree)
        generateConvert(code, tree.type, type, tree.abs)
        return {
            type,
            code,
        }
    }
}

function generateCode(code: InstrCode[], tree: TreeNode) {
    switch (tree.kind) {
        case "err":
            throw Error(tree.message)
        case "num":
            code.push(`${tree.type}.const ${tree.value}`)
            return
        case "var":
            code.push(`local.get ${tree.name}`)
            return
        case "ope":
            generateCode(code, tree.a)
            generateConvert(code, tree.a.type, tree.type, tree.abs)
            generateCode(code, tree.b)
            generateConvert(code, tree.b.type, tree.type, tree.abs)
            code.push(`${tree.type}.${tree.code}`)
            return
    }
}

function generateConvert(
    code: InstrCode[],
    fromType: LocalType,
    toType: LocalType,
    abs: boolean
) {
    if (fromType === "bool") fromType = "i32"
    if (toType === "bool") toType = "i32"
    if (fromType === toType) return

    const sign = abs ? "u" : "s"
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
                    code.push(`i32.wrap_i32`)
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
                    code.push(`f32.promote_f32`)
                    return
            }
            return
    }
}
