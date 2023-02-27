import React from "react"
import Theme from "@/ui/theme"
import Style from "./Touchable.module.css"

const $ = Theme.classNames

export interface TouchableProps<T> {
    className?: string
    children: React.ReactNode
    title?: string
    tag?: T
    onClick?(tag: T | undefined): void
}

export default function Touchable<T>({
    className,
    children,
    tag,
    title,
    onClick,
}: TouchableProps<T>) {
    if (!onClick) return <>{children}</>

    return (
        <div
            className={$.join(className, Style.Touchable)}
            title={title}
            onClick={() => onClick(tag)}
        >
            {children}
        </div>
    )
}
