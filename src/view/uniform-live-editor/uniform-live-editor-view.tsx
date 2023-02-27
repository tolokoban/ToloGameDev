import * as React from "react"
import InputFloat from "@/ui/view/InputFloat"
import Slider from "@/ui/view/Slider"
import { TGDPainterUniform } from "../../types"
import "./uniform-live-editor-view.css"

export type UniformLiveEditorViewProps = {
    className?: string
    uniform: TGDPainterUniform
}

export default function UniformLiveEditorView(
    props: UniformLiveEditorViewProps
) {
    if (!props.uniform.active) return null

    return (
        <>
            <div className={getClassNames(props)}>{props.uniform.name}</div>
            <Editor uniform={props.uniform} />
        </>
    )
}

function Editor(props: UniformLiveEditorViewProps) {
    const { data } = props.uniform
    switch (data.type) {
        case "Value":
            return (
                <InputFloat
                    value={data.value}
                    onChange={(value) => (data.value = value)}
                />
            )
        case "Slider":
            return (
                <Slider
                    text={(v) => v.toFixed(3)}
                    min={data.min}
                    max={data.max}
                    value={data.value}
                    onChange={(value) => (data.value = value)}
                />
            )

        default:
            return <div>{JSON.stringify(data)}</div>
    }
}

function getClassNames(props: UniformLiveEditorViewProps): string {
    const classNames = ["custom", "view-UniformLiveEditorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
