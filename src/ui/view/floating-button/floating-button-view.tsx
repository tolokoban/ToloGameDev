import * as React from "react"
import { getSizeStyle } from "../_common"
import { Icon } from "../icons/generic"
import { ThemeColorName, View, ViewWithSize } from "../types"
import "./floating-button-view.css"
/**
 * @see https://material.io/components/buttons-floating-action-button#usage
 */

export type FloatingButtonViewProps<Tag> = View &
    ViewWithSize & {
        icon: Icon
        /** HTML default tooltip */
        title?: string
        color?: ThemeColorName
        enabled?: boolean
        tag?: Tag
        type?: "bold" | "filled" | "outlined" | "dual"
        onClick?(tag?: Tag): void
    }

export default function FloatingButtonView<Tag>(
    props: FloatingButtonViewProps<Tag>
) {
    const handleClick = () => {
        const { onClick, tag } = props
        if (!onClick) return

        onClick(tag)
    }
    return (
        <button
            className={getClassNames<Tag>(props)}
            style={getSizeStyle(props.size)}
            onClick={handleClick}
            title={props.title}
        >
            {props.icon({ type: props.type })}
        </button>
    )
}

function getClassNames<Tag>(props: FloatingButtonViewProps<Tag>): string {
    const { className, enabled, color } = props
    const classNames = ["custom", "ui-view-FloatingButtonView"]
    if (typeof className === "string") {
        classNames.push(className)
    }
    if (enabled === false) classNames.push("disabled")
    classNames.push(`theme-color-${color ?? "primary"}`)
    return classNames.join(" ")
}
