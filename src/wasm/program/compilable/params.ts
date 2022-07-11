import { LocalType } from "./../../types"
export default class Params {
    private _params: { [name: string]: LocalType } = {}

    get current() {
        return { ...this._params }
    }
    set current(params: { [name: string]: LocalType }) {
        this._params = { ...params }
    }

    get available() {
        const names = Object.keys(this._params)
        if (names.length === 0) return "No param defined in this function."

        return `Available params are: ${names
            .map((name) => `$${name}`)
            .join(", ")}.`
    }

    has(name: string) {
        name = sanitize(name)
        return typeof this._params[name] !== "undefined"
    }

    /**
     * @returns Type of the param or an exception if not exist.
     */
    get(name: string): LocalType {
        name = sanitize(name)
        const type = this._params[name]
        if (!type)
            throw Error(
                `No param was declared with the name $${name}!\nPossible names are: ${Object.keys(
                    this._params
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
