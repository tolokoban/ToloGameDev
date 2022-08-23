import * as React from "react"
import { getDataService } from "@/factory/data-service"
import { PainterPageProps } from "../painter-page"
import { TGDPainter } from "@/types"

export function usePainterLoader(
    props: PainterPageProps,
    setBusy: React.Dispatch<React.SetStateAction<boolean>>,
    setPainter: React.Dispatch<React.SetStateAction<TGDPainter | null>>,
    setValidPainter: React.Dispatch<React.SetStateAction<TGDPainter | null>>
) {
    React.useEffect(() => {
        if (props.id === -1) {
            setBusy(false)
            return
        }
        setBusy(true)
        getDataService()
            .painter.get(props.id)
            .then((value) => {
                setBusy(false)
                if (value) {
                    setPainter(value)
                    setValidPainter(value)
                }
            })
            .catch((ex) =>
                console.error(`Unable to get painter #${props.id}!`, ex)
            )
    }, [props.id])
}
