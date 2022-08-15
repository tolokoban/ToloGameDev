import DataStore from "./datastore"
import { isObject, isString } from "../tools/type-guards"
import { TGDShaders } from "./../types"

export default class DataService {
    public readonly shaders = new DataStore<TGDShaders>(
        "shaders",
        isProgramType
    )
}

function isProgramType(data: unknown): data is TGDShaders {
    return (
        isObject(data) &&
        isString(data.name) &&
        isString(data.description) &&
        isString(data.vertexShader) &&
        isString(data.fragmentShader)
    )
}
