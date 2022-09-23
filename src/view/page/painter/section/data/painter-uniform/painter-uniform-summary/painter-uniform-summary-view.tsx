import * as React from "react"
import { TGDPainterUniformData } from "@/types"
import "./painter-uniform-summary-view.css"

export interface PainterUniformSummaryViewProps {
    className?: string
    value: TGDPainterUniformData
}

export default function PainterUniformSummaryView(
    props: PainterUniformSummaryViewProps
) {
    const data = props.value
    switch (data.type) {
        case "Value":
            return (
                <div className={getClassNames(props)}>
                    Value = <b>{data.value}</b>
                </div>
            )
        case "Slider":
            return (
                <div className={getClassNames(props)}>
                    Min = <b>{data.min}</b>, Max = <b>{data.max}</b>
                </div>
            )
        default:
            return null
    }
}

function getClassNames(props: PainterUniformSummaryViewProps): string {
    const classNames = [
        "custom",
        "view-page-painter-section-data-painterUniform-PainterUniformSummaryView",
    ]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
