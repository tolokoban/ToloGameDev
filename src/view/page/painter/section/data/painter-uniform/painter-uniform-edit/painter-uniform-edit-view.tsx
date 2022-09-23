import * as React from "react"
import IconEdit from "@/ui/view/icons/edit"
import InputFloat from "@/ui/view/input/float"
import Modal from "@/ui/modal"
import { TGDPainterUniformData } from "@/types"
import "./painter-uniform-edit-view.css"

export interface PainterUniformEditViewProps {
    name: string
    value: TGDPainterUniformData
    onChange(this: void, value: TGDPainterUniformData): void
}

export default function PainterUniformEditView(
    props: PainterUniformEditViewProps
) {
    const handleClick = makeClickHandler(props)
    if (!handleClick) return null
    return <IconEdit onClick={handleClick} />
}

function makeClickHandler(props: PainterUniformEditViewProps) {
    switch (props.value.type) {
        case "Value":
            return makeClickHandlerForValue(props)
        case "Slider":
            return makeClickHandlerForSlider(props)
        default:
            return undefined
    }
}

function makeClickHandlerForValue(props: PainterUniformEditViewProps) {
    const data = props.value
    const name = props.name
    const onChange = props.onChange
    return async () => {
        if (data.type !== "Value") return

        let { value } = data
        const confirm = await Modal.confirm({
            autoClosable: true,
            title: name,
            content: (
                <InputFloat
                    label="Value"
                    value={value}
                    onChange={(v) => (value = v)}
                />
            ),
        })
        if (confirm) {
            onChange({
                ...props.value,
                type: "Value",
                value,
            })
        }
    }
}
function makeClickHandlerForSlider(props: PainterUniformEditViewProps) {
    const data = props.value
    const name = props.name
    const onChange = props.onChange
    return async () => {
        if (data.type !== "Slider") return

        let { value, min, max } = data
        const confirm = await Modal.confirm({
            autoClosable: true,
            title: name,
            content: (
                <div>
                    <InputFloat
                        label="Min"
                        value={min}
                        onChange={(v) => (min = v)}
                    />
                    <InputFloat
                        label="Max"
                        value={max}
                        onChange={(v) => (max = v)}
                    />
                    <InputFloat
                        label="Value"
                        value={value}
                        onChange={(v) => (value = v)}
                    />
                </div>
            ),
        })
        if (confirm) {
            onChange({
                ...props.value,
                type: "Slider",
                value,
                min,
                max,
            })
        }
    }
}
