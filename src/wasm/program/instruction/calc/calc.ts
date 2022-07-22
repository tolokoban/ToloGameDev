import Program from "../../program"
import Scanner, { TreeNode, TreeNodeOpe } from "./scanner"
import { generateConvert, generateConvertInteger } from "./convert"
import { InstrCode, Instruction } from "../../../types"
import { maxType } from "./max-type"
import { WasmType } from "../../../types"

export default class Calc {
    constructor(private readonly prg: Program) {}

    readonly i32 = make("i32", this.prg)
    readonly i64 = make("i64", this.prg)
    readonly f32 = make("f32", this.prg)
    readonly f64 = make("f64", this.prg)
}

function make<T extends WasmType>(type: T, prg: Program) {
    return (source: string): Instruction<T> => {
        try {
            const code: InstrCode[] = [`;; Calc: ${source}`]
            const scanner = new Scanner(prg)
            const tree = scanner.buildTree(source)
            generateCode(code, tree, source)
            generateConvert(code, tree.type, type, tree.alwaysPositive)
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
    try {
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
            case "var":
                code.push(`local.get ${node.name}`)
                return
            case "ope":
                generateCodeForOpe(code, node, source)
                code.push(`${node.type}.${node.code}`)
                return
            case "memory":
                if (node.index.kind === "num") {
                    // Optimiztion for BPE.
                    code.push(
                        `i32.const ${
                            node.bufferOffset + node.bpe * node.index.value
                        }`
                    )
                } else {
                    generateCode(code, node.index, source)
                    switch (node.bpe) {
                        case 1:
                            // No tride.
                            break
                        case 2:
                            code.push("i32.const 1", "i32.shl")
                            break
                        case 4:
                            code.push("i32.const 2", "i32.shl")
                            break
                        case 8:
                            code.push("i32.const 3", "i32.shl")
                            break
                        default:
                            code.push(`i32.const ${node.bpe}`, "i32.mul")
                            break
                    }
                    if (node.bufferOffset > 0) {
                        code.push(`i32.const ${node.bufferOffset}`, "i32.add")
                    }
                }
                code.push(`${node.type}.load${node.extension}`)
                return
            default:
                throw Error(`Unknown scanner item "${node.kind}"!`)
        }
    } catch (ex) {
        console.error("Unable to evaluate:", source)
        console.error(ex)
        throw ex
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
            generateConvert(code, node.a.type, node.type, node.alwaysPositive)
            generateCode(code, node.b, source)
            generateConvert(code, node.b.type, node.type, node.alwaysPositive)
            break
        case "and":
        case "or":
        case "xor":
            generateCode(code, node.a, source)
            generateConvertInteger(
                code,
                node.a.type,
                node.type,
                node.alwaysPositive
            )
            generateCode(code, node.b, source)
            generateConvertInteger(
                code,
                node.b.type,
                node.type,
                node.alwaysPositive
            )
            break
        case "le":
        case "ge":
        case "lt":
        case "gt":
            const type = maxType(node.code, node.a.type, node.b.type)
            generateCode(code, node.a, source)
            generateConvert(code, node.a.type, type, node.alwaysPositive)
            generateCode(code, node.b, source)
            generateConvert(code, node.b.type, type, node.alwaysPositive)
            if (type.charAt(0) === "i") {
                node.code = `${node.code}_${
                    node.a.alwaysPositive && node.b.alwaysPositive ? "u" : "s"
                }`
            }
            node.type = type
            break
    }
}
