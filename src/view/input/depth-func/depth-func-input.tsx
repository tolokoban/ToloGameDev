import * as React from "react"
import Label from "@/ui/view/label"
import Options from "@/ui/view/options"
import { TGDPainterDepthFunc } from "@/types"
import "./depth-func-input.css"

const OPTIONS = {
    NEVER: "NEVER",
    LESS: "LESS",
    EQUAL: "EQUAL",
    LEQUAL: "LEQUAL",
    GREATER: "GREATER",
    NOTEQUAL: "NOTEQUAL",
    GEQUAL: "GEQUAL",
    ALWAYS: "ALWAYS",
}

export interface DepthFuncInputProps {
    className?: string
    value: TGDPainterDepthFunc
    onChange(value: TGDPainterDepthFunc): void
}

export default function DepthFuncInput(props: DepthFuncInputProps) {
    const id = imp(props.value)
    return (
        <div className={getClassNames(props)}>
            <Label value="Depth Function" />
            <Options
                options={OPTIONS}
                value={id}
                onChange={(value) => props.onChange(exp(value))}
            />
        </div>
    )
}

function imp(value: TGDPainterDepthFunc): string {
    switch (value) {
        case TGDPainterDepthFunc.NEVER:
            return "NEVER"
        case TGDPainterDepthFunc.LESS:
            return "LESS"
        case TGDPainterDepthFunc.EQUAL:
            return "EQUAL"
        case TGDPainterDepthFunc.LEQUAL:
            return "LEQUAL"
        case TGDPainterDepthFunc.GREATER:
            return "GREATER"
        case TGDPainterDepthFunc.NOTEQUAL:
            return "NOTEQUAL"
        case TGDPainterDepthFunc.GEQUAL:
            return "GEQUAL"
        case TGDPainterDepthFunc.ALWAYS:
            return "ALWAYS"
        default:
            throw Error(`Don't know about drawing mode #${value}!`)
    }
}

function exp(value: string): TGDPainterDepthFunc {
    switch (value) {
        case "NEVER":
            return TGDPainterDepthFunc.NEVER
        case "LESS":
            return TGDPainterDepthFunc.LESS
        case "EQUAL":
            return TGDPainterDepthFunc.EQUAL
        case "LEQUAL":
            return TGDPainterDepthFunc.LEQUAL
        case "GREATER":
            return TGDPainterDepthFunc.GREATER
        case "NOTEQUAL":
            return TGDPainterDepthFunc.NOTEQUAL
        case "GEQUAL":
            return TGDPainterDepthFunc.GEQUAL
        case "ALWAYS":
            return TGDPainterDepthFunc.ALWAYS
        default:
            throw Error(`Don't know about drawing mode "${value}"!`)
    }
}

function getClassNames(props: DepthFuncInputProps): string {
    const classNames = ["custom", "view-input-DepthFuncInput"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
