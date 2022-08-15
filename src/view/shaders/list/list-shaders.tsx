import * as React from "react"
import ObjectButton from "../../object-button"
import Runnable from "@/ui/view/runnable"
import { TGDObject } from "@/types"
import { useShadersList } from "@/hooks/programs-list"
import "./list-shaders.css"

export interface ListProgramProps {
    className?: string
    onClick(this: void, program: TGDObject): void
}

export default function ListProgram(props: ListProgramProps) {
    const shadersList = useShadersList()
    return (
        <Runnable className={getClassNames(props)} running={!shadersList}>
            {shadersList &&
                shadersList.map((item) => (
                    <ObjectButton
                        key={item.id}
                        type="program"
                        value={item}
                        onClick={props.onClick}
                    />
                ))}
            {Array.isArray(shadersList) && shadersList.length === 0 && (
                <p>
                    No shaders have been created yet.
                    <br />
                    Use the above button to add new ones.
                </p>
            )}
        </Runnable>
    )
}

function getClassNames(props: ListProgramProps): string {
    const classNames = ["custom", "view-program-LisShaders"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
