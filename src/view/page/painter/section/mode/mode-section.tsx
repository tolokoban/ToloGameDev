import * as React from "react"
import Blending from "./blending"
import Depth from "./depth"
import DrawModeInput from "@/view/input/draw-mode/draw-mode-input"
import { PainterUpdater } from "../../hooks/painter-updater"
import "./mode-section.css"

export interface ModeSectionProps {
    className?: string
    updater: PainterUpdater
}

export default function ModeSection(props: ModeSectionProps) {
    const { updater } = props
    const painter = updater.currentPainter
    return (
        <div className={getClassNames(props)}>
            <DrawModeInput value={painter.mode} onChange={updater.setMode} />
            <Depth updater={updater} />
            <Blending updater={updater} />
        </div>
    )
}

function getClassNames(props: ModeSectionProps): string {
    const classNames = ["custom", "view-page-painter-section-ModeSection"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
