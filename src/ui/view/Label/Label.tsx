import React from "react"
import Theme from "@/ui/theme"
import Style from "./Label.module.css"
import { ColorName } from "../../theme/styles/types"

const $ = Theme.classNames

export interface LabelProps {
    className?: string
    value?: string
    title?: string
    color?: ColorName
    children?: React.ReactNode
}

export default function Label({
    color,
    className,
    value,
    title,
    children,
}: LabelProps): JSX.Element {
    const id = `labelled/${React.useId()}`
    if (!value) return <>{children}</>

    const style: React.CSSProperties = {}
    if (color) style.color = `var(--theme-color-${color})`
    return (
        <>
            <label
                htmlFor={id}
                title={title}
                className={$.join(className, Style.Label)}
                style={style}
            >
                {value}
            </label>
            <div id={id} className={Style.LabelContent}>
                {children}
            </div>
        </>
    )
}
