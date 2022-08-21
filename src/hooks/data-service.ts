import * as React from "react"
import DataService from "../service/data-service"
import { getDataService } from "../factory/data-service"

export function useDataService(): DataService {
    const refService = React.useRef(getDataService())
    return refService.current
}
