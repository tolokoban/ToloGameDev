import Program from ".."
import { LocalType } from "../../types"
import { parseTokens, Token } from "./lexer"

export type TreeNode = TreeNodeErr | TreeNodeOpe | TreeNodeVar | TreeNodeNum

interface TreeNodeCommon {
    kind: string
    type: LocalType
    abs: boolean
}

interface TreeNodeErr extends TreeNodeCommon {
    kind: "err"
    message: string
    index: number
}

interface TreeNodeOpe extends TreeNodeCommon {
    kind: "ope"
    code: "add" | "sub" | "mul" | "div"
    a: TreeNode
    b: TreeNode
}

interface TreeNodeVar extends TreeNodeCommon {
    kind: "var"
    name: string
}

interface TreeNodeNum extends TreeNodeCommon {
    kind: "num"
    value: number
}

const OPE_CODES = {
    "+": "add",
    "-": "sub",
    "*": "mul",
    "/": "div",
}

export default class Scanner {
    constructor(private readonly prg: Program) {}

    public buildTree(sourceCode: string): TreeNode {
        const tokens = getTokens(sourceCode)
        const root = this.scan(tokens)
        return optimizeTree(root)
    }

    private scan(tokens: Token[]): TreeNode {
        let root =
            this.scanNum(tokens) ??
            this.scanHex(tokens) ??
            this.scanMonoBloc(tokens) ??
            this.scanVar(tokens) ??
            makeErr("Unexpected token!", tokens[0])
        for (;;) {
            const ope = this.scanOpe(tokens)
            if (!ope) break

            const secondArgument = this.scan(tokens)
            if (!secondArgument)
                return makeErr(
                    `Missing argument for binary operator "${ope.code}"!`,
                    tokens[0]
                )
            const firstArgument = root
            root = {
                ...ope,
                abs: firstArgument.abs || secondArgument.abs,
                type: maxType(firstArgument.type, secondArgument.type),
                a: firstArgument,
                b: secondArgument,
            }
        }
        return root
    }

    private scanMonoBloc(tokens: Token[]): TreeNode | null {
        const bloc = this.scanBloc(tokens)
        if (!bloc) return null

        if (bloc.length !== 1) {
            throw Error("There is more than one ")
        }
        return bloc[0]
    }

    private scanBloc(tokens: Token[]): TreeNode[] | null {
        const text = checkToken(tokens, "PAR_OPEN")
        if (!text) return null

        const data: TreeNode[] = []
        while (!checkToken(tokens, "PAR_CLOSE")) data.push(this.scan(tokens))
        return data
    }

    private scanOpe(
        tokens: Token[]
    ): Omit<TreeNodeOpe, "a" | "b" | "type" | "abs"> | null {
        const text = checkToken(
            tokens,
            "ADD",
            "SUB",
            "MUL",
            "DIV",
            "AND",
            "OR",
            "XOR"
        )
        if (!text) return null

        return {
            kind: "ope",
            code: OPE_CODES[text] ?? "?",
        }
    }

    private scanNum(tokens: Token[]): TreeNodeNum | null {
        const text = checkToken(tokens, "NUM")
        if (!text) return null

        const value = parseFloat(text)
        return {
            kind: "num",
            type: value === Math.floor(value) ? "i32" : "f32",
            abs: value < 0 ? false : true,
            value,
        }
    }

    private scanHex(tokens: Token[]): TreeNodeNum | null {
        const text = checkToken(tokens, "HEX")
        if (!text) return null

        const value = parseInt(text)
        return {
            kind: "num",
            type: "i32",
            abs: true,
            value,
        }
    }

    private scanVar(tokens: Token[]): TreeNodeVar | TreeNodeErr | null {
        const name = checkToken(tokens, "VAR")
        if (!name) return null

        const { prg } = this
        if (prg.$params.has(name)) {
            return {
                kind: "var",
                type: prg.$params.get(name),
                abs: false,
                name,
            }
        }
        return makeErr(
            `${name} is not a param nor a local!\n${prg.$params.available}`,
            tokens[0]
        )
    }
}

function checkToken(tokens: Token[], ...names: string[]): string | null {
    const [token] = tokens
    if (!token) return null

    const [id, text] = token
    if (names.includes(id)) {
        tokens.shift()
        return text
    }

    return null
}

function makeErr(message: string, token: Token): TreeNodeErr {
    return {
        kind: "err",
        type: "bool",
        abs: true,
        message,
        index: token[2],
    }
}

function maxType(t1: LocalType, t2: LocalType): LocalType {
    if (t1 === "bool" && t2 === "bool") return "bool"

    const [t1Char, t1Num] = splitType(t1)
    const [t2Char, t2Num] = splitType(t2)
    const char = t1Char === "f" || t2Char === "f" ? "f" : "i"
    return `${char}${Math.max(t1Num, t2Num)}` as LocalType
}

function splitType(type: string): [string, number] {
    if (type === "bool") type = "i32"
    return [type.charAt(0), parseInt(type.substring(1))]
}

export function optimizeTree(root: TreeNode): TreeNode {
    if (root.kind !== "ope") return root

    root.a = optimizeTree(root.a)
    root.b = optimizeTree(root.b)
    if (root.a.kind !== "num" || root.b.kind !== "num") return root

    const a = root.a.value
    const b = root.b.value
    const t = root.type
    switch (root.code) {
        case "add":
            return makeNum(a + b, t)
        case "sub":
            return makeNum(a - b, t)
        case "mul":
            return makeNum(a * b, t)
        case "div":
            return makeNum(a / b, t)
        default:
            return root
    }
}

function makeNum(value: number, type: LocalType): TreeNodeNum {
    return {
        kind: "num",
        type: value === Math.floor(value) ? "i32" : "f32",
        abs: value < 0 ? false : true,
        value,
    }
}

function getTokens(source: string) {
    const tokens = parseTokens(source)
    let blocLevel = 0
    for (const [tkn] of tokens) {
        if (tkn === "PAR_OPEN") blocLevel++
        else if (tkn === "PAR_CLOSE") blocLevel--
    }
    if (blocLevel !== 0) throw Error(`Unbalanced parenthesis!\n"${source}"`)
    return tokens
}
