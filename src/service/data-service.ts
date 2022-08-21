import DataStore from "./datastore"
import { isObject, isString } from "../tools/type-guards"
import { TGDPainter } from "./../types"

export default class DataService {
    public readonly painter = new DataStore<TGDPainter>(
        "painter",
        isPainterType
    )
}

function isPainterType(data: unknown): data is TGDPainter {
    return (
        isObject(data) &&
        isString(data.name) &&
        isString(data.description) &&
        isString(data.vertexShader) &&
        isString(data.fragmentShader)
    )
}
