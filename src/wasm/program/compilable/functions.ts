import { FuncOptions } from "../../types"

export default class Functions {
    private readonly _functions: { [name: string]: FuncOptions } = {}

    public current = ""

    get(name?: string): FuncOptions {
        if (!name) name = this.current
        const item = this._functions[name]
        if (!item)
            throw Error(
                `There is no function with name "${name}"!\nPossible names are: ${Object.keys(
                    this._functions
                )
                    .map((n) => `"${n}"`)
                    .join(", ")}`
            )
        return item
    }

    add(item: FuncOptions) {
        if (this._functions[item.name])
            throw Error(`There is already a function with name "${item.name}"!`)
        this._functions[item.name] = item
    }
}
