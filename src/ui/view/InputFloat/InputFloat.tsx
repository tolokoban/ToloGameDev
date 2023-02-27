import React from "react"
import InputText from "../InputText"
import Theme from "@/ui/theme"
import Style from "./InputFloat.module.css"
import { ViewWithValue } from "../../types"
import { SpaceStyleProps } from "../../theme/styles/space"

const $ = Theme.classNames

export type InputFloatProps = ViewWithValue<number> & {
    className?: string
    placeholder?: string
    type?: "text" | "email" | "password" | "number"
    maxWidth?: string
    min?: number
    max?: number
    label?: string
} & SpaceStyleProps

export default function InputFloat({
    className,
    value,
    onChange,
    min = Number.MIN_VALUE,
    max = Number.MAX_VALUE,
    label,
    placeholder,
}: InputFloatProps) {
    return (
        <InputText
            className={$.join(className, Style.InputFloat)}
            label={label}
            placeholder={placeholder}
            value={`${value}`}
            onChange={(v) => onChange?.(parseFloat(v))}
            validator={(value) => {
                const num = parseFloat(value)
                if (!isNaN(num)) return false
                return num >= min && num <= max
            }}
        />
    )
}
