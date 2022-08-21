import * as React from "react"
import { getDataService } from "../factory/data-service"
import { TGDObject } from "../types"
import { useDataService } from "./data-service"

/**
 *
 * @returns `null` while loading the list from the database.
 */
export function usePaintersList(): TGDObject[] | null {
    const data = useDataService()
    const [painters, setPainters] = React.useState<TGDObject[] | null>(null)
    React.useEffect(() => {
        const update = () => data.painter.list().then(setPainters)
        update()
        data.painter.eventChange.add(update)
        return () => data.painter.eventChange.remove(update)
    }, [])
    return painters
}
