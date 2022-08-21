import DataService from "../service/data-service"

let globalDataService: null | DataService = null

export function getDataService() {
    if (!globalDataService) {
        globalDataService = new DataService()
    }
    return globalDataService
}
