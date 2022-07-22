import MemoryManager from "../../manager/memory-manager"
import Program from "../../program"
import { maxType } from "./max-type"
import { parseTokens, Token } from "./lexer"
import { WasmType } from "../../../types"

export type TreeNode =
    | TreeNodeErr
    | TreeNodeOpe
    | TreeNodeVar
    | TreeNodeNum
    | TreeNodeOffset
    | TreeNodeMemory

interface TreeNodeCommon {
    kind: string
    type: WasmType
    alwaysPositive?: boolean
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
    bufferName: string
    /** Offset in bytes. */
    offset: number
    /** Bytes per element */
    bpe: number
    /**
     * Reading an element of a Uint8Array is done with a i32 type
     * and this wasm instruction: `i32.load8_u`. So, in this case,
     * the extension will be "8_u".
     */
    extension: string
}

interface TreeNodeMemory extends TreeNodeCommon {
    kind: "memory"
    bufferName: string
    bufferOffset: number
    /** Element index in the array */
    index: TreeNode
    /**
     * Reading an element of a Uint8Array is done with a i32 type
     * and this wasm instruction: `i32.load8_u`. So, in this case,
     * the extension will be "8_u".
     */
    extension: string
    /** Bytes per element */
    bpe: number
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
                alwaysPositive:
                    firstArgument.alwaysPositive ||
                    secondArgument.alwaysPositive,
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
        const offset = this.prg.$memory.offset(name)
        const type = this.prg.$memory.type(name)
        const mem = this.prg.$memory
        return {
            kind: "offset",
            alwaysPositive: mem.isAlwaysPositive(name),
            bufferName: name,
            offset: mem.offset(name),
            bpe: mem.bpe(name),
            type: mem.type(name),
            extension: mem.extension(name),
        }
    }

    /**
     * Should parse memory reading.
     * ```
     * @[42]
     * @position[0]
     * @base[(3*$y) + $x]
     * ```
     */
    private scanMemory(tokens: Token[]): TreeNodeMemory | null {
        const offset = this.scanOffset(tokens)
        if (!offset) return null

        const text = checkToken(tokens, "BRA_OPEN")
        if (!text) {
            throw Error(
                `To access a memory element, we expect a open bracket!\nSomething like "@[3]" or "@bank2[0].`
            )
        }

        const data: TreeNode[] = []
        while (!checkToken(tokens, "BRA_CLOSE")) data.push(this.scan(tokens))
        if (data.length !== 1)
            throw Error(`Only one expression is allowed in brackets!`)

        const [body] = data
        const { alwaysPositive, bufferName, extension, bpe, type } = offset
        return {
            kind: "memory",
            bufferName,
            bufferOffset: offset.offset,
            index: body,
            bpe,
            extension,
            alwaysPositive,
            type,
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
            alwaysPositive: value < 0 ? false : true,
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
            alwaysPositive: true,
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
                alwaysPositive: false,
                name,
            }
        }
        if (prg.$locals.has(name)) {
            return {
                kind: "var",
                type: prg.$locals.get(name),
                alwaysPositive: false,
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
        alwaysPositive: true,
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

function makeNum(value: number, type: WasmType): TreeNodeNum {
    return {
        kind: "num",
        type: value === Math.floor(value) ? "i32" : "f32",
        alwaysPositive: value < 0 ? false : true,
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
