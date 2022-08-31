import * as React from "react"
import IconChecked from "@/ui/view/icons/checked"
import IconUnchecked from "@/ui/view/icons/unchecked"
import Touchable from "@/ui/view/touchable"
import "./button-glsl-snippet.css"

export interface ButtonGlslSnippetProps {
    className?: string
    label: string
    value: boolean
    onChange(value: boolean): void
}

export default function ButtonGlslSnippet(props: ButtonGlslSnippetProps) {
    const { label, value } = props
    return (
        <Touchable
            className={getClassNames(props)}
            wide={true}
            onClick={() => props.onChange(!value)}
        >
            {value && <IconChecked />}
            {!value && <IconUnchecked />}
            <div>{label}</div>
        </Touchable>
    )
}

function getClassNames(props: ButtonGlslSnippetProps): string {
    const classNames = [
        "custom",
        "view-input-glslSnippet-ButtonGlslSnippet",
        `theme-color-primary-${props.value ? "light" : "dark"}`,
    ]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
