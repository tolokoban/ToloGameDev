import * as React from "react"
import Modal from "@/ui/modal/modal"
import { getDataService } from "@/factory/data-service"
import { PainterUpdater } from "./painter-updater"
import {
    TGDPainter,
    TGDPainterBlendingEqua,
    TGDPainterBlendingFunc,
    TGDPainterDepthFunc,
    TGDPainterMode,
} from "../../../../types"

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

                const base: TGDPainter = {
                    attributes: [],
                    blending: {
                        enabled: false,
                        equaRGB: TGDPainterBlendingEqua.ADD,
                        equaAlpha: TGDPainterBlendingEqua.ADD,
                        funcSrcRGB: TGDPainterBlendingFunc.ONE,
                        funcSrcAlpha: TGDPainterBlendingFunc.ONE,
                        funcDstRGB: TGDPainterBlendingFunc.ZERO,
                        funcDstAlpha: TGDPainterBlendingFunc.ZERO,
                    },
                    count: {
                        element: 0,
                        instance: 0,
                        loop: 1,
                        vertex: 0,
                    },
                    depth: {
                        enabled: false,
                        clear: 1,
                        func: TGDPainterDepthFunc.LESS,
                        mask: true,
                        range: { near: 0, far: 1 },
                    },
                    description: "",
                    elements: [],
                    error: "",
                    id: 0,
                    mode: TGDPainterMode.TRIANGLES,
                    name: "",
                    shader: { vert: "", frag: "" },
                    uniforms: [],
                }
                refUpdater.current.reset({
                    ...base,
                    attributes: painter.attributes,
                    blending: { ...base.blending, ...painter.blending },
                    count: { ...base.count, ...painter.count },
                    depth: { ...base.depth, ...painter.depth },
                    description: painter.description,
                    elements: painter.elements,
                    error: painter.error,
                    id: painter.id,
                    mode: painter.mode,
                    name: painter.name,
                    shader: painter.shader,
                    uniforms: painter.uniforms,
                })
                window.setTimeout(compile, 100)
            })
            .catch((ex) => console.error(`Unable to get painter #${id}!`, ex))
    }, [id])
}
