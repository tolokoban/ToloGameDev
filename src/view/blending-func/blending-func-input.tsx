import * as React from "react"
import Combo from "@/ui/view/combo"
import { ComboItems } from "../../ui/view/combo/combo-view"
import { TGDPainterBlendingFunc } from "@/types"
import "./blending-func-input.css"

export interface BlendingFuncInputProps {
    className?: string
    label?: string
    value: TGDPainterBlendingFunc
    onChange(this: void, value: TGDPainterBlendingFunc): void
}

const ITEMS: ComboItems<TGDPainterBlendingFunc> = [
    [
        TGDPainterBlendingFunc.ZERO,
        <div>
            <b>ZERO</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.ONE,
        <div>
            <b>ONE</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.SRC_COLOR,
        <div>
            <b>SRC_COLOR</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.ONE_MINUS_SRC_COLOR,
        <div>
            <b>ONE_MINUS_SRC_COLOR</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.DST_COLOR,
        <div>
            <b>DST_COLOR</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.ONE_MINUS_DST_COLOR,
        <div>
            <b>ONE_MINUS_DST_COLOR</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.SRC_ALPHA,
        <div>
            <b>SRC_ALPHA</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.ONE_MINUS_SRC_ALPHA,
        <div>
            <b>ONE_MINUS_SRC_ALPHA</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.DST_ALPHA,
        <div>
            <b>DST_ALPHA</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.ONE_MINUS_DST_ALPHA,
        <div>
            <b>ONE_MINUS_DST_ALPHA</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.CONSTANT_COLOR,
        <div>
            <b>CONSTANT_COLOR</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.ONE_MINUS_CONSTANT_COLOR,
        <div>
            <b>ONE_MINUS_CONSTANT_COLOR</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.CONSTANT_ALPHA,
        <div>
            <b>CONSTANT_ALPHA</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.ONE_MINUS_CONSTANT_ALPHA,
        <div>
            <b>ONE_MINUS_CONSTANT_ALPHA</b>
        </div>,
    ],
    [
        TGDPainterBlendingFunc.SRC_ALPHA_SATURATE,
        <div>
            <b>SRC_ALPHA_SATURATE</b>
        </div>,
    ],
]

export default function BlendingFuncInput(props: BlendingFuncInputProps) {
    return (
        <Combo<TGDPainterBlendingFunc>
            className={getClassNames(props)}
            label={props.label}
            value={props.value}
            onChange={props.onChange}
            items={ITEMS}
        />
    )
}

function getClassNames(props: BlendingFuncInputProps): string {
    const classNames = ["custom", "ui-view-input-BlendingFuncInput"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
