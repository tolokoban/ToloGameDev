import React from "react"
import Theme from "@/ui/theme"
import Style from "./ExportSection.module.css"
import { TGDPainter } from "@/types"
import CodeViewer from "@/view/code-viewer/code-viewer-view"
import { generateSingleFileScript } from "./single-file"

const $ = Theme.classNames

export interface ExportSectionProps {
    className?: string
    painter: TGDPainter
}

export default function ExportSection({
    className,
    painter,
}: ExportSectionProps) {
    const scriptCode = generateSingleFileScript(painter)
    return (
        <div className={$.join(className, Style.ExportSection)}>
            <CodeViewer language="ts" value={scriptCode} />
        </div>
    )
}
