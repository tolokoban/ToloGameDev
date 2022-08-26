import DataStore from "./datastore"
import { isTGDPainter } from "@/guards"
import { makeTGDPainter } from "../factory/painter"
import { TGDPainter } from "@/types"

export default class DataService {
    public readonly painter = new DataStore<TGDPainter>(
        "painter",
        isTGDPainter,
        makeTGDPainter
    )
}
