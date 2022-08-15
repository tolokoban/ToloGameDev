import * as React from "react"
import DataService from "../service/data-service"
import { makeDataService } from "../factory/data-service"

export function useDataService(): DataService {
    const refService = React.useRef(makeDataService())
    return refService.current
}
