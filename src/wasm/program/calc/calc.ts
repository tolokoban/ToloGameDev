import Program from ".."
import Scanner, { TreeNode, TreeNodeOpe } from "./scanner"
import { generateConvert, generateConvertInteger } from "./convert"
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
        try {
            const code: InstrCode[] = [`;; Calc: ${source}`]
            const scanner = new Scanner(prg)
            const tree = scanner.buildTree(source)
            generateCode(code, tree, source)
            generateConvert(code, tree.type, type, tree.abs)
            return {
                type,
                code,
            }
        } catch (ex) {
            console.log("Error in code: ", source)
            console.error(ex)
            throw ex
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
            generateCodeForOpe(code, node, source)
            code.push(`${node.type}.${node.code}`)
            return
        case "memory":
            generateCode(code, node.offset, source)
            code.push(`${node.type}.load`)
            return
    }
}

function spc(count: number): string {
    let txt = ""
    for (let i = 0; i < count; i++) txt = `${txt} `
    return txt
}

function generateCodeForOpe(
    code: InstrCode[],
    node: TreeNodeOpe,
    source: string
) {
    switch (node.code) {
        case "add":
        case "div":
        case "mul":
        case "sub":
            generateCode(code, node.a, source)
            generateConvert(code, node.a.type, node.type, node.abs)
            generateCode(code, node.b, source)
            generateConvert(code, node.b.type, node.type, node.abs)
            break
        case "and":
        case "or":
        case "xor":
            generateCode(code, node.a, source)
            generateConvertInteger(code, node.a.type, node.type, node.abs)
            generateCode(code, node.b, source)
            generateConvertInteger(code, node.b.type, node.type, node.abs)
            break
        case "le":
        case "ge":
        case "lt":
        case "gt":
            node.type = "i32"
            generateCode(code, node.a, source)
            generateConvert(code, node.a.type, "i32", node.abs)
            generateCode(code, node.b, source)
            generateConvert(code, node.b.type, "i32", node.abs)
            node.code = `${node.code}_${node.a.abs && node.b.abs ? "u" : "s"}`
            break
    }
}
