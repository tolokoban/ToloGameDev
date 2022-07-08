import { InstrCode } from "./types"

/**
 * Convert `code` into a WebAssemble Text.
 */
export function stringifyCode(code: InstrCode, ctx = { indent: 0 }): string {
    if (typeof code === "string") {
        let relativeIndent = 0
        for (const c of code) {
            if (c === "(") relativeIndent++
            else if (c === ")") relativeIndent--
        }
        if (relativeIndent < 0) ctx.indent += relativeIndent
        const indent = makeIndent(ctx.indent)
        if (relativeIndent > 0) ctx.indent += relativeIndent
        return `${indent}${code}\n`
    }

    if (Array.isArray(code)) {
        return code.map((x) => stringifyCode(x, ctx)).join("")
    }

    if (code.before) {
        console.log("HSDGKKKKKKKKKKKKKKKKKKKK")
        code.before()
    }
    const result = stringifyCode(code.code, ctx)
    if (code.after) code.after()
    return result
}

const INDENT = "  "

function makeIndent(value: number): string {
    let txt = ""
    for (let i = 0; i < value; i++) txt += INDENT
    return txt
}
