import * as React from "react"
import { makeDataService } from "../factory/data-service"
import { TGDObject } from "./../types"
import { useDataService } from "./data-service"

/**
 *
 * @returns `null` while loading the list from the database.
 */
export function useShadersList(): TGDObject[] | null {
    const data = useDataService()
    const [shaders, setShaders] = React.useState<TGDObject[] | null>(null)
    React.useEffect(() => {
        const update = () => data.shaders.list().then(setShaders)
        update()
        data.shaders.eventChange.add(update)
        return () => data.shaders.eventChange.remove(update)
    }, [])
    return shaders
}
