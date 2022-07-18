const TOKENS: { [id: string]: RegExp } = {
    SPC: /^[ \t\n\r]+/g,
    VAR: /^\$[a-z][a-z0-9_]*/gi,
    PAR_OPEN: /^[(]/g,
    PAR_CLOSE: /^[)]/g,
    BRA_OPEN: /^\[/g,
    BRA_CLOSE: /^\]/g,
    OFFSET: /^@[a-z][a-z0-9_]*/gi,
    LE: /^\<\=/g,
    GE: /^\>\=/g,
    LT: /^\</g,
    GT: /^\>/g,
    ADD: /^\+/g,
    SUB: /^\-/g,
    MUL: /^\*/g,
    DIV: /^\//g,
    MOD: /^\%/g,
    AND: /^\&/g,
    OR: /^\|/g,
    XOR: /^\^/g,
    HEX: /^0x[0-9a-f]+/gi,
    NUM: /^[-]?[0-9]+(\.[0-9]+)?([eE][-]?[0-9]+)?/g,
}

export type Token = [token: string, text: string, index: number]

export function parseTokens(code: string): Token[] {
    const tokens: Token[] = []
    let index = 0
    while (index < code.length) {
        const [tkn, txt] = nextToken(code, index)
        const cursor = index
        index += txt.length
        if (tkn === "SPC") continue

        tokens.push([tkn, txt, cursor])
    }
    return detectNumbersSigns(tokens)
}

function nextToken(code: string, index: number): Token {
    for (const key of Object.keys(TOKENS)) {
        const text = checkToken(code, index, key)
        if (!text) continue

        return [key, text, index]
    }
    throw Error(
        `Unexpected token at position ${index}: "${code.substring(
            index
        )}"\n"${code}"`
    )
}

export function checkToken(
    code: string,
    index: number,
    token: string
): string | null {
    const rx = TOKENS[token]
    if (!rx) throw Error(`Token "${token}" does not exist!`)

    rx.lastIndex = -1
    const match = rx.exec(code.substring(index))
    if (!match) return null

    return match[0]
}

const EXPRESSIONS: string[] = [
    "VAR",
    "PAR_CLOSE",
    "BRA_CLOSE",
    "OFFSET",
    "HEX",
    "NUM",
]

/**
 * "-5" is parsed as `["SUB", "NUM:5"].
 * But we want to get a négative number instead: ["NUM:-5"]
 */
function detectNumbersSigns(tokens: Token[]): Token[] {
    const out: Token[] = []
    let previousTokenIsExpression = true
    let previousTokenIsSub = false
    for (const [tkn, txt, idx] of tokens) {
        if (tkn === "SUB") {
            if (previousTokenIsExpression) {
                out.push([tkn, txt, idx])
                previousTokenIsExpression = false
            } else {
                previousTokenIsSub = true
            }
        } else {
            if (previousTokenIsSub && tkn === "NUM") {
                out.push(["NUM", `${-parseFloat(txt)}`, idx])
            } else if (previousTokenIsSub && tkn === "HEX") {
                out.push(["NUM", `${-parseInt(txt)}`, idx])
            } else {
                out.push([tkn, txt, idx])
            }
            previousTokenIsSub = tkn === "SUB"
        }
        previousTokenIsExpression = EXPRESSIONS.includes(tkn)
    }
    return out
}
