import * as React from "react"
import Label from "@/ui/view/label"
import Options from "@/ui/view/options"
import { TGDPainterMode } from "@/types"
import "./draw-mode-input.css"

const OPTIONS = {
    POINTS: "POINTS",
    LINE_STRIP: "LINE_STRIP",
    LINE_LOOP: "LINE_LOOP",
    LINES: "LINES",
    TRIANGLE_STRIP: "TRIANGLE_STRIP",
    TRIANGLE_FAN: "TRIANGLE_FAN",
    TRIANGLES: "TRIANGLES",
}

const TIPS: { [key: string]: string } = {
    POINTS: "Single dot per vertex",
    LINE_STRIP: "One line going through all vertices",
    LINE_LOOP:
        "One line going through all vertices and looping to the first one",
    LINES: "Lines segments for two consecutive vertices",
    TRIANGLE_STRIP: "For each vertex, take the previous two to draw a triangle",
    TRIANGLE_FAN: "The first vertex is common to all triangles",
    TRIANGLES: "Triangles for each triplet of vertices",
}

export interface DrawModeInputProps {
    className?: string
    value: TGDPainterMode
    onChange(value: TGDPainterMode): void
}

export default function DrawModeInput(props: DrawModeInputProps) {
    const id = imp(props.value)
    return (
        <fieldset>
            <legend>Drawing Primitive</legend>
            <div className={getClassNames(props)}>
                <Options
                    options={OPTIONS}
                    value={id}
                    onChange={(value) => props.onChange(exp(value))}
                />
                <p>{TIPS[id]}</p>
            </div>
        </fieldset>
    )
}

function imp(value: TGDPainterMode): string {
    switch (value) {
        case TGDPainterMode.POINTS:
            return "POINTS"
        case TGDPainterMode.LINE_STRIP:
            return "LINE_STRIP"
        case TGDPainterMode.LINE_LOOP:
            return "LINE_LOOP"
        case TGDPainterMode.LINES:
            return "LINES"
        case TGDPainterMode.TRIANGLE_STRIP:
            return "TRIANGLE_STRIP"
        case TGDPainterMode.TRIANGLE_FAN:
            return "TRIANGLE_FAN"
        case TGDPainterMode.TRIANGLES:
            return "TRIANGLES"
        default:
            throw Error(`Don't know about drawing mode #${value}!`)
    }
}

function exp(value: string): TGDPainterMode {
    switch (value) {
        case "POINTS":
            return TGDPainterMode.POINTS
        case "LINE_STRIP":
            return TGDPainterMode.LINE_STRIP
        case "LINE_LOOP":
            return TGDPainterMode.LINE_LOOP
        case "LINES":
            return TGDPainterMode.LINES
        case "TRIANGLE_STRIP":
            return TGDPainterMode.TRIANGLE_STRIP
        case "TRIANGLE_FAN":
            return TGDPainterMode.TRIANGLE_FAN
        case "TRIANGLES":
            return TGDPainterMode.TRIANGLES
        default:
            throw Error(`Don't know about drawing mode "${value}"!`)
    }
}

function getClassNames(props: DrawModeInputProps): string {
    const classNames = ["custom", "view-input-DrawModeInput"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
