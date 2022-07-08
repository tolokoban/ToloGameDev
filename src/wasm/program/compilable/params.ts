import { LocalType } from "./../../types"
export default class Params {
    private _params: { [name: string]: LocalType } = {}

    get current() {
        return { ...this._params }
    }
    set current(params: { [name: string]: LocalType }) {
        this._params = { ...params }
    }

    /**
     * @returns Type of the param or an exception if not exist.
     */
    get(name: string): LocalType {
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
