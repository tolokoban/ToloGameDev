import React from "react"
import Theme from "@/ui/theme"
import Style from "./Panel.module.css"
import { Circumference } from "../../theme/styles/types"
import { ColorStyleProps, styleColor } from "../../theme/styles/color"
import { SpaceStyleProps, styleSpace } from "../../theme/styles/space"
import { OverflowStyleProps, styleOverflow } from "../../theme/styles/overflow"
import { DisplayStyleProps, styleDisplay } from "../../theme/styles/display"
import {
    DimensionStyleProps,
    styleDimension,
} from "../../theme/styles/dimension"
import { cssForGaps } from "../../theme/styles/styles"

const $ = Theme.classNames

export type PanelProps = {
    className?: string
    children: React.ReactNode
    borderRadius?: Circumference
    fontSize?: string
    aspectRatio?: number
} & ColorStyleProps &
    SpaceStyleProps &
    DimensionStyleProps &
    OverflowStyleProps &
    DisplayStyleProps

function Panel(props: PanelProps) {
    const {
        className,
        children,
        borderRadius,
        fontSize,
        aspectRatio = 0,
    } = props
    const style: React.CSSProperties = {
        fontSize,
        ...styleColor(props),
        ...styleSpace(props),
        ...styleDimension(props),
        ...styleOverflow(props),
        ...styleDisplay(props),
    }
    if (aspectRatio > 0) style["--custom-aspect-ratio"] = aspectRatio
    if (borderRadius) style.borderRadius = cssForGaps(borderRadius)
    return (
        <div className={$.join(className, Style.Panel)} style={style}>
            {children}
        </div>
    )
}

export function makeCustomPanel(
    defaultProps: Partial<PanelProps>
): (props: PanelProps) => JSX.Element {
    return (props: PanelProps) =>
        Panel({
            ...defaultProps,
            ...props,
        })
}

export default Panel
