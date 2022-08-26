import * as React from "react"
import Button from "@/ui/view/button"
import Flex from "@/ui/view/flex"
import Renderer from "./renderer"
import { TGDPainter } from "@/types"
import { useDebouncedEffect } from "@/ui/hooks"
import "./preview-view.css"

export interface PreviewViewProps {
    className?: string
    painter: TGDPainter | null
}

export default function PreviewView(props: PreviewViewProps) {
    const refCanvas = React.useRef<null | HTMLCanvasElement>(null)
    const refRenderer = React.useRef<null | Renderer>()
    useDebouncedEffect(
        () => {
            if (refRenderer.current) {
                refRenderer.current.destroy()
            }
            const canvas = refCanvas.current
            if (!canvas) throw Error("Canvas is not mounted yet!")

            if (props.painter) {
                refRenderer.current = new Renderer(canvas, props.painter)
            }
        },
        20,
        [props.painter]
    )
    const handleFullscreen = () => {
        const canvas = refCanvas.current
        if (!canvas) return

        canvas.requestFullscreen({
            navigationUI: "hide",
        })
    }
    return (
        <div className={getClassNames(props)}>
            <Flex justifyContent="space-between">
                <h1>Preview</h1>
                <Button
                    flat={true}
                    label="Full screen"
                    onClick={handleFullscreen}
                />
            </Flex>
            <canvas ref={refCanvas} className="theme-shadow-card"></canvas>
        </div>
    )
}

function getClassNames(props: PreviewViewProps): string {
    const classNames = ["custom", "view-PreviewView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
