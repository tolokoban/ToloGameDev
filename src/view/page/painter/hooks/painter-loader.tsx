import * as React from "react"
import { getDataService } from "@/factory/data-service"
import { PainterUpdater } from "./painter-updater"

export function usePainterLoader(id: number, updater: PainterUpdater) {
    const refUpdater = React.useRef(updater)
    refUpdater.current = updater
    React.useEffect(() => {
        if (id < 0) return
        getDataService()
            .painter.get(id)
            .then((painter) => {
                if (!painter) return

                refUpdater.current.reset(painter).validate()
            })
            .catch((ex) => console.error(`Unable to get painter #${id}!`, ex))
    }, [id])
}
