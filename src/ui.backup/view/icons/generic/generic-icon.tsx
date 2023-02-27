import * as React from "react"
import { getColorStyle } from "../../_common"
import { View, ViewWithColor } from "../../types"
import "./generic-icon.css"

export type GenericIconProps = View &
    ViewWithColor & {
        type?: "filled" | "outlined" | "bold" | "dual"
        /** Starts the animation if `true` */
        animate?: boolean
        /** Dscription of the drawing. Ex.: `M8,20L12,10L16,20Z` */
        value: string
        onClick?(): void
    }

export type Icon = ((
    props?: Omit<GenericIconProps, "value">
) => JSX.Element) & { id: string }

export default function GenericIcon(props: GenericIconProps) {
    const { value } = props
    const type = props.type ?? "filled"
    return (
        <svg
            className={getClassName(props)}
            style={getColorStyle(props.color)}
            viewBox="0 0 24 24"
            preserveAspectRatio="xMidYMid meet"
            onClick={props.onClick}
            tabIndex={props.onClick ? 1 : undefined}
            strokeWidth={1.5}
        >
            {type === "filled" && (
                <path d={value} fill="currentColor" stroke="none" />
            )}
            {type === "outlined" && (
                <path d={value} fill="none" stroke="currentColor" />
            )}
            {type === "bold" && (
                <path d={value} fill="currentColor" stroke="currentColor" />
            )}
            {type === "dual" && (
                <>
                    <path
                        d={value}
                        opacity={0.25}
                        fill="currentColor"
                        stroke="none"
                    />
                    <path d={value} fill="none" stroke="currentColor" />
                </>
            )}
        </svg>
    )
}

function getClassName(props: GenericIconProps): string {
    const classNames = ["custom", "view", "ui-view-icons-GenericIcon"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.animate === true) classNames.push("animate")
    if (props.onClick) classNames.push("clickable")

    return classNames.join(" ")
}
