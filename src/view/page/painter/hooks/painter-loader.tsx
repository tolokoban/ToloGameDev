import * as React from "react"
import { getDataService } from "@/factory/data-service"
import { PainterUpdater } from "./painter-updater"
import { TGDPainter } from "@/types"
import { useModal } from "@/ui/modal"

export function usePainterLoader(
    id: number,
    updater: PainterUpdater,
    compile: () => void
) {
    const modal = useModal()
    const refUpdater = React.useRef(updater)
    refUpdater.current = updater
    React.useEffect(() => {
        if (id < 0) return

        modal
            .wait(`Loading Painter #${id}...`, getDataService().painter.get(id))
            .then((painter: TGDPainter | undefined) => {
                console.log("Painter loaded:", id)
                console.log("🚀 [painter-loader] painter = ", painter) // @FIXME: Remove this line written on 2022-08-25 at 16:36
                if (!painter) return

                const base: TGDPainter = {
                    attributes: [],
                    blending: {
                        enabled: false,
                        equaRGB: "FUNC_ADD",
                        equaAlpha: "FUNC_ADD",
                        funcSrcRGB: "ONE",
                        funcSrcAlpha: "ONE",
                        funcDstRGB: "ZERO",
                        funcDstAlpha: "ZERO",
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
                        func: "LESS",
                        mask: true,
                        range: { near: 0, far: 1 },
                    },
                    description: "",
                    elements: [],
                    error: "",
                    id: 0,
                    mode: "TRIANGLES",
                    name: "",
                    shader: { vert: "", frag: "" },
                    uniforms: [],
                    textures: [],
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
            .catch((ex: unknown) =>
                console.error(`Unable to get painter #${id}!`, ex)
            )
    }, [id])
}
