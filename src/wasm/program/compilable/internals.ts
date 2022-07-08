import Functions from "./functions"
import Params from "./params"
import { LocalType } from "../../types"

export default class Internals {
    private _id = 1
    private _params: { [name: string]: LocalType } = {}
    private readonly _locals = new Map<string, LocalType>()
    protected _textResources: string[] = []

    readonly $functions = new Functions()
    readonly $params = new Params()

    get $textResources() {
        return [...this._textResources]
    }

    $addTextResource(text: string): number {
        if (!this._textResources.includes(text)) this._textResources.push(text)
        return this._textResources.indexOf(text)
    }

    $declareLocal(name: string, type: LocalType) {
        this._locals.set(`${name}`, type)
    }

    $getLocals() {
        return Array.from(this._locals.entries())
            .map(([name, type]) => `(local $${name}_${type} ${type})`)
            .join(" ")
    }

    $getLocalType(name: string): LocalType {
        const type = this._locals.get(name)
        if (!type)
            throw Error(
                `No local was declared with the name $${name}!\nPossible names are: ${Array.from(
                    this._locals.keys()
                )
                    .map((n) => `$${n}`)
                    .join(", ")}`
            )

        return type
    }

    $makeId(name: string) {
        return `${name}_${this._id++}`
    }
}
