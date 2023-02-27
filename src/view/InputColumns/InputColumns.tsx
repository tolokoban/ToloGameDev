import React from "react"
import Theme from "@/ui/theme"
import Style from "./InputColumns.module.css"

const $ = Theme.classNames

export interface InputColumnsProps {
    className?: string
    columns: number
    children: React.ReactNode
}

export default function InputColumns({
    className,
    columns,
    children,
}: InputColumnsProps) {
    return (
        <div
            style={{ "--custom-columns": columns }}
            className={$.join(className, Style.InputColumns)}
        >
            {children}
        </div>
    )
}
