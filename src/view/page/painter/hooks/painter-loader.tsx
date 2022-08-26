import * as React from "react"
import Modal from "@/ui/modal/modal"
import { getDataService } from "@/factory/data-service"
import { PainterUpdater } from "./painter-updater"

export function usePainterLoader(
    id: number,
    updater: PainterUpdater,
    compile: () => void
) {
    const refUpdater = React.useRef(updater)
    refUpdater.current = updater
    React.useEffect(() => {
        if (id < 0) return

        Modal.wait(
            `Loading Painter #${id}...`,
            getDataService().painter.get(id)
        )
            .then((painter) => {
                console.log("Painter loaded:", id)
                console.log("🚀 [painter-loader] painter = ", painter) // @FIXME: Remove this line written on 2022-08-25 at 16:36
                if (!painter) return

                refUpdater.current.reset(painter)
                window.setTimeout(compile, 100)
            })
            .catch((ex) => console.error(`Unable to get painter #${id}!`, ex))
    }, [id])
}
