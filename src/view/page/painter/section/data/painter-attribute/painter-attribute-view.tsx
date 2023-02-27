import * as React from "react"
import IconEdit from "@/ui/view/icons/IconEdit"
import InputInteger from "@/ui/view/InputInteger"
import Touchable from "@/ui/view/Touchable"
import { TGDPainterAttribute } from "@/types"
import "./painter-attribute-view.css"
import CheckBox from "@/ui/view/Checkbox"

export interface PainterAttributeViewProps {
    className?: string
    value: TGDPainterAttribute
    data: number[]
    active: boolean
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
            <div
                className={`view-page-painter-PainterAttributeView name ${
                    props.active ? "active" : "inactive"
                }`}
            >
                {att.name}
                {att.size > 1 ? `[${att.size}]` : ""}
            </div>
            <CheckBox
                value={att.dynamicGroup > 0}
                onChange={(dynamicGroup) =>
                    update({ dynamicGroup: dynamicGroup ? 1 : 0 })
                }
            />
            <InputInteger
                maxWidth="2em"
                value={att.divisor}
                onChange={(divisor) => update({ divisor })}
            />
            <Touchable
                className="view-page-painter-PainterAttributeView data"
                onClick={() => props.onClick(props.value)}
            >
                {props.active && (
                    <div className="data-view active">
                        {props.data
                            .slice(0, 32)
                            .map((n) => `${n}`)
                            .join(", ")}
                    </div>
                )}
                {!props.active && (
                    <div className="data-view inactive">
                        {att.name} is not currently used in the vertex shader.
                        <br />
                        However, we still keep its data if you need them later.
                    </div>
                )}
                <IconEdit />
            </Touchable>
        </>
    )
}
