import Functions from "./functions"
import Locals from "./local"
import Params from "./params"
import { LocalType } from "../../types"

export default class Internals {
    private _id = 1
    protected _textResources: string[] = []

    readonly $functions = new Functions()
    readonly $params = new Params()
    readonly $locals = new Locals()

    get $textResources() {
        return [...this._textResources]
    }

    $addTextResource(text: string): number {
        if (!this._textResources.includes(text)) this._textResources.push(text)
        return this._textResources.indexOf(text)
    }

    $makeId(name: string) {
        return `${name}_${this._id++}`
    }
}
