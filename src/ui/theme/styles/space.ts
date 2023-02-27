import { cssForGaps } from "./styles"
import { Circumference } from "./types"

export interface SpaceStyleProps {
    borderRadius?: Circumference
    margin?: Circumference
    padding?: Circumference
    gap?: string | number | [column: string | number, row: string | number]
}

export function styleSpace({
    borderRadius,
    margin,
    padding,
    gap,
}: SpaceStyleProps) {
    const style: React.CSSProperties = {}
    if (borderRadius) style.borderRadius = cssForGaps(borderRadius)
    if (margin) style.margin = cssForGaps(margin)
    if (padding) style.padding = cssForGaps(padding)
    if (gap) style.gap = cssForGaps(gap)
    return style
}
