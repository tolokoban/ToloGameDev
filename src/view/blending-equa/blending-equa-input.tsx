import * as React from "react"
import Combo from "@/ui/view/combo"
import { ComboItems } from "../../ui/view/combo/combo-view"
import { TGDPainterBlendingEqua, TGDPainterBlendingFunc } from "@/types"
import "./blending-equa-input.css"

export interface BlendingEquaInputProps {
    className?: string
    label?: string
    value: TGDPainterBlendingEqua
    onChange(this: void, value: TGDPainterBlendingEqua): void
}

const ITEMS: ComboItems<TGDPainterBlendingEqua> = [
    [
        TGDPainterBlendingEqua.ADD,
        <div>
            <b>ADD</b>: src + dst
        </div>,
    ],
    [
        TGDPainterBlendingEqua.SUBTRACT,
        <div>
            <b>SUBSTRACT</b>: src - dst
        </div>,
    ],
    [
        TGDPainterBlendingEqua.REVERSE_SUBTRACT,
        <div>
            <b>REVERSE_SUBSTRACT</b>: dst - src
        </div>,
    ],
    [
        TGDPainterBlendingEqua.MIN,
        <div>
            <b>MIN</b>: min(src, dst)
        </div>,
    ],
    [
        TGDPainterBlendingEqua.MAX,
        <div>
            <b>MAX</b>: max(src, dst)
        </div>,
    ],
]

export default function BlendingEquaInput(props: BlendingEquaInputProps) {
    return (
        <Combo<TGDPainterBlendingEqua>
            className={getClassNames(props)}
            label={props.label}
            value={props.value}
            onChange={props.onChange}
            items={ITEMS}
        />
    )
}

function getClassNames(props: BlendingEquaInputProps): string {
    const classNames = ["custom", "ui-view-input-BlendingEquaInput"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
