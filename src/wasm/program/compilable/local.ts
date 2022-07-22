import { WasmType } from "../../types"

export default class Locals {
    private _locals: { [name: string]: WasmType } = {}

    get current() {
        return { ...this._locals }
    }
    set current(locals: { [name: string]: WasmType }) {
        this._locals = { ...locals }
    }

    get available() {
        const names = Object.keys(this._locals)
        if (names.length === 0) return "No local defined in this function."

        return `Available locals are: ${names
            .map((name) => `$${name}`)
            .join(", ")}.`
    }

    get all() {
        return Object.keys(this._locals).map(sanitize)
    }

    clear() {
        this._locals = {}
    }

    add(name: string, type: WasmType) {
        name = sanitize(name)
        const currentType = this._locals[name]
        if (!currentType) {
            this._locals[name] = type
            return
        }
        if (type !== currentType)
            throw Error(
                `$${name} has already been defined with type "${currentType}"!\nYou are trying to redefined it with type "${type}".`
            )
        return typeof this._locals[name] !== "undefined"
    }

    has(name: string) {
        name = sanitize(name)
        return typeof this._locals[name] !== "undefined"
    }

    /**
     * @returns Type of the local or an exception if not exist.
     */
    get(name: string): WasmType {
        name = sanitize(name)
        const type = this._locals[name]
        if (!type)
            throw Error(
                `No local was declared with the name $${name}!\nPossible names are: ${Object.keys(
                    this._locals
                )
                    .map((n) => `"${n}"`)
                    .join(", ")}`
            )

        return type
    }
}

function sanitize(name: string): string {
    if (name.charAt(0) === "$") return name.substring(1)
    return name
}
