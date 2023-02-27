import * as React from "react"
import Combo, { ComboItems } from "@/ui/view/Combo"
import "./const-select-view.css"

export interface ConstSelectViewProps<T extends { [key: string]: string }> {
    className?: string
    label?: string
    items: T
    value: keyof T
    onChange(this: void, value: keyof T): void
}

export default function ConstSelectView<T extends { [key: string]: string }>(
    props: ConstSelectViewProps<T>
) {
    return (
        <Combo<keyof T>
            className={props.className}
            label={props.label}
            hideLabel={true}
            value={props.value}
            onChange={props.onChange}
            items={makeItems(props.items)}
        />
    )
}

function makeItems<T extends { [key: string]: string }>(
    items: T
): ComboItems<keyof T> {
    const result: ComboItems<keyof T> = []
    for (const key of Object.keys(items)) {
        result.push([key, <div title={items[key]}>{key}</div>])
    }
    return result
}
