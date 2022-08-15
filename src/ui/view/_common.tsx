import * as React from "react"
import { ColorName, ThemeColorName } from "./types"
import "./_common.css"

export function isThemeColor(color: ColorName): color is ThemeColorName {
    if (color === "inherit") return false
    if (color.startsWith("#")) return false
    if (color.startsWith("rgb(")) return false
    return true
}

export function getColorStyle(
    color?: ColorName
): React.CSSProperties | undefined {
    if (!color) return
    if (color === "inherit") return
    if (isThemeColor(color)) return { color: `var(--theme-color-${color})` }
    return { color }
}

export function getSizeStyle(
    size?: "small" | "medium" | "large",
    base = 100
): React.CSSProperties | undefined {
    if (!size) return
    switch (size) {
        case "small":
            return { fontSize: `${0.8 * base}%` }
        case "large":
            return { fontSize: `${1.2 * base}%` }
        default:
            return { fontSize: "100%" }
    }
}
