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
        const code: InstrCode[] = [`;; Calc: ${source}`]
        const scanner = new Scanner(prg)
        const tree = scanner.buildTree(source)
        console.log("🚀 [calc] tree = ", tree) // @FIXME: Remove this line written on 2022-07-11 at 14:14
        generateCode(code, tree, source)
        generateConvert(code, tree.type, type, tree.abs)
        return {
            type,
            code,
        }
    }
}

function generateCode(code: InstrCode[], node: TreeNode, source: string) {
    switch (node.kind) {
        case "err":
            throw Error(
                `${node.message}\nError occured at position ${
                    node.index
                } in\n"${source}"\n ${spc(node.index)}^`
            )
        case "num":
            code.push(`${node.type}.const ${node.value}`)
            return
        case "offset":
            code.push(`i32.const ${node.value}`)
            return
        case "var":
            code.push(`local.get ${node.name}`)
            return
        case "ope":
            generateCode(code, node.a, source)
            generateConvert(code, node.a.type, node.type, node.abs)
            generateCode(code, node.b, source)
            generateConvert(code, node.b.type, node.type, node.abs)
            code.push(`${node.type}.${node.code}`)
            return
        case "memory":
            generateCode(code, node.offset, source)
            code.push(`${node.type}.load`)
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

function spc(count: number): string {
    let txt = ""
    for (let i = 0; i < count; i++) txt = `${txt} `
    return txt
}
