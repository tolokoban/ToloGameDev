import { arrayBuffer } from "stream/consumers"

const INDENT = "  "

type Instr = (ctx: Context) => void
type ContextItem = string | Instr | ContextItem[]

export default class Context {
    private ids = new Map<string, number>()
    private readonly items: string[] = []
    private readonly indentation: string[] = []
    private locals = new Set<string>()

    getNextId(name: string): string {
        const id = 1 + (this.ids.get(name) ?? 0)
        this.ids.set(name, id)
        return `${name}_${id}`
    }

    getLocals(): Array<[name: string, type: string]> {
        return Array.from(this.locals).map((name) => [
            name,
            name.substring(name.length - 3),
        ])
    }

    declareLocal_i32(name: string) {
        const n = `${name}_i32`
        this.locals.add(n)
        return n
    }

    declareLocal_i64(name: string) {
        const n = `${name}_i64`
        this.locals.add(n)
        return n
    }

    declareLocal_f32(name: string) {
        const n = `${name}_f32`
        this.locals.add(n)
        return n
    }

    declareLocal_f64(name: string) {
        const n = `${name}_f64`
        this.locals.add(n)
        return n
    }

    indent() {
        this.indentation.push(INDENT)
    }

    unindent() {
        if (this.indentation.length > 0) this.indentation.pop()
    }

    push(...lines: ContextItem[]) {
        const indentation = this.indentation.join("")
        for (const value of lines) {
            if (typeof value === "string") {
                this.items.push(`${indentation}${value}`)
            } else if (Array.isArray(value)) {
                this.indent()
                this.push(...value)
                this.unindent()
            } else {
                value(this)
            }
        }
    }

    toString() {
        return this.items.join("\n")
    }
}
