import * as React from "react"
import Blending from "./blending"
import ConstSelect from "@/view/const-select"
import Depth from "./depth"
import { PainterUpdater } from "../../hooks/painter-updater"
import { WEBGL2 } from "@/tgd/constants"
import "./mode-section.css"
import Panel from "@/ui/view/Panel"

export interface ModeSectionProps {
    className?: string
    updater: PainterUpdater
}

export default function ModeSection(props: ModeSectionProps) {
    const { updater } = props
    const painter = updater.currentPainter
    return (
        <Panel
            className={getClassNames(props)}
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
        >
            <ConstSelect
                label="Primitive"
                value={painter.mode}
                onChange={updater.setMode}
                items={WEBGL2.drawPrimitive}
            />
            <Depth updater={updater} />
            <Blending updater={updater} />
        </Panel>
    )
}

function getClassNames(props: ModeSectionProps): string {
    const classNames = ["custom", "view-page-painter-section-ModeSection"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
