import Program from ".."
import { LocalType, MemoryItem } from "../../types"
import { maxType } from "./max-type"
import { parseTokens, Token } from "./lexer"

export type TreeNode =
    | TreeNodeErr
    | TreeNodeOpe
    | TreeNodeVar
    | TreeNodeNum
    | TreeNodeOffset
    | TreeNodeMemory

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

export interface TreeNodeOpe extends TreeNodeCommon {
    kind: "ope"
    code:
        | "add"
        | "sub"
        | "mul"
        | "div"
        | "and"
        | "or"
        | "xor"
        | "lt"
        | "gt"
        | "le"
        | "ge"
        | "lt_u"
        | "gt_u"
        | "le_u"
        | "ge_u"
        | "lt_s"
        | "gt_s"
        | "le_s"
        | "ge_s"
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

interface TreeNodeOffset extends TreeNodeCommon {
    kind: "offset"
    /** Name of the buffer. */
    name: string
    /** Offset in bytes. */
    value: number
    bufferType: string
}

interface TreeNodeMemory extends TreeNodeCommon {
    kind: "memory"
    buffer: MemoryItem
    offset: TreeNode
}

const OPE_CODES = {
    "+": "add",
    "-": "sub",
    "*": "mul",
    "/": "div",
    "&": "and",
    "|": "or",
    "^": "xor",
    "<": "lt",
    ">": "gt",
}

export default class Scanner {
    constructor(private readonly prg: Program) {}

    public buildTree(sourceCode: string): TreeNode {
        const tokens = getTokens(sourceCode)
        const root = this.scan(tokens)
        return optimizeTree(root)
    }

    private scan(tokens: Token[]): TreeNode {
        let root: TreeNode =
            this.scanNum(tokens) ??
            this.scanHex(tokens) ??
            this.scanMonoBloc(tokens) ??
            this.scanVar(tokens) ??
            this.scanOffset(tokens) ??
            this.scanMemory(tokens) ??
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
                type: maxType(
                    ope.code,
                    firstArgument.type,
                    secondArgument.type
                ),
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

    private scanOffset(tokens: Token[]): TreeNodeOffset | null {
        const text = checkToken(tokens, "OFFSET")
        if (!text) return null

        const name = text.substring(1)
        const memory = this.prg.$memory.get(name)
        return {
            kind: "offset",
            abs: ["Uint8Clamped"].includes(memory.type),
            bufferType: memory.type,
            name,
            value: memory.offset,
            type: "i32",
        }
    }

    private scanMemory(tokens: Token[]): TreeNodeMemory | null {
        const text = checkToken(tokens, "BRA_OPEN")
        if (!text) return null

        const data: TreeNode[] = []
        while (!checkToken(tokens, "BRA_CLOSE")) data.push(this.scan(tokens))
        if (data.length !== 1)
            throw Error(`Only one expression is allowed in brackets!`)

        const [body] = data
        const buffer: MemoryItem = findMemoryItem(body, this.prg.$memory)
        return {
            kind: "memory",
            buffer,
            offset: body,
            abs: buffer.type === "Uint8Clamped",
            type: getMemoryType(buffer),
        }
    }

    private scanOpe(
        tokens: Token[]
    ): Omit<TreeNodeOpe, "a" | "b" | "type" | "abs"> | null {
        const text = checkToken(
            tokens,
            "LE",
            "GE",
            "LT",
            "GT",
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
        if (prg.$locals.has(name)) {
            return {
                kind: "var",
                type: prg.$locals.get(name),
                abs: false,
                name,
            }
        }
        return makeErr(
            `${name} is not a param nor a local!\n${prg.$params.available}\n${prg.$locals.available}`,
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
    console.error(message, token)
    return {
        kind: "err",
        type: "bool",
        abs: true,
        message,
        index: token[2],
    }
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

function getMemoryType(memory: MemoryItem): LocalType {
    switch (memory.type) {
        case "Float32":
            return "f32"
        case "Uint32":
        case "Uint8Clamped":
            return "i32"
        default:
            throw Error(
                `Memory type "${memory.type}" has not been implemented yet!`
            )
    }
}

function findMemoryItem(
    body: TreeNode,
    memory: { get(name?: string): MemoryItem }
): MemoryItem {
    const offsets: TreeNodeOffset[] = []
    lookForOffsets(offsets, body)
    const set = new Set(offsets)
    if (set.size > 1)
        throw Error(`Which offset should I use? ${Array.from(set).join(", ")}`)
    const [offset] = offsets
    return memory.get(offset?.name)
}

function lookForOffsets(offsets: TreeNodeOffset[], node: TreeNode) {
    const { kind } = node
    switch (node.kind) {
        case "err":
        case "num":
        case "var":
        case "memory":
            return
        case "offset":
            offsets.push(node)
            return
        case "ope":
            lookForOffsets(offsets, node.a)
            lookForOffsets(offsets, node.b)
            return
        default:
            throw Error(
                `Type "${kind}" has not yet been implemented for lookForOffsets()!`
            )
    }
}
