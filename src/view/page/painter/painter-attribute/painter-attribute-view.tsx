import * as React from "react"
import IconEdit from "@/ui/view/icons/edit"
import InputInteger from "@/ui/view/input/integer"
import Touchable from "@/ui/view/touchable"
import { TGDPainterAttribute } from "../../../../types"
import "./painter-attribute-view.css"

export interface PainterAttributeViewProps {
    className?: string
    value: TGDPainterAttribute
    data: number[]
    onChange(value: TGDPainterAttribute): void
    onClick(value: TGDPainterAttribute): void
}

export default function PainterAttributeView(props: PainterAttributeViewProps) {
    const att = props.value
    const update = (update: Partial<TGDPainterAttribute>) => {
        props.onChange({
            ...props.value,
            ...update,
        })
    }
    return (
        <>
            <div className="view-page-painter-PainterAttributeView name">
                {att.name}
                {att.size > 1 ? `[${att.size}]` : ""}
            </div>
            <InputInteger
                size={2}
                value={att.divisor}
                onChange={(divisor) => update({ divisor })}
            />
            <Touchable
                className="view-page-painter-PainterAttributeView data"
                onClick={() => props.onClick(props.value)}
            >
                <div className="data-view">
                    {props.data.map((n) => `${n}`).join(", ")}
                </div>
                <IconEdit />
            </Touchable>
        </>
    )
}
