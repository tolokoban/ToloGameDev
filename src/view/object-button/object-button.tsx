import * as React from "react"
import Touchable from "@/ui/view/touchable"
import { TGDObject } from "../../types"
import "./object-button.css"

export interface ButtonProgramProps {
    className?: string
    type: "painter"
    value: TGDObject
    onClick(value: TGDObject): void
}

export default function ButtonProgram(props: ButtonProgramProps) {
    return (
        <Touchable
            className={getClassNames(props)}
            onClick={() => props.onClick(props.value)}
            title={props.value.name}
        >
            <div className="name">{props.value.name}</div>
            <div className="id">{props.value.id}</div>
        </Touchable>
    )
}

function getClassNames(props: ButtonProgramProps): string {
    const classNames = [
        "custom",
        "view-program-ButtonProgram",
        "theme-shadow-button",
        "theme-color-primary",
        props.type,
    ]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
