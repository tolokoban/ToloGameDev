import React from "react"
import Theme from "@/ui/theme"
import Style from "./Checkbox.module.css"
import { ViewWithValue } from "../../types"
import IconChecked from "../icons/IconChecked"
import IconUnchecked from "../icons/IconUnchecked"
import { useChangeableValue } from "../../hooks/changeable-value"
import { ColorName } from "../../theme/styles/types"
import { styleSpace } from "../../theme/styles/space"

const $ = Theme.classNames

export type CheckboxProps = ViewWithValue<boolean> & {
    className?: string
    children?: React.ReactNode
    color?: ColorName
    gap?: string | number
}

export default function Checkbox({
    value,
    onChange,
    className,
    children = "",
    color,
    gap = "M",
}: CheckboxProps) {
    const [val, setVal] = useChangeableValue({ value, onChange })
    const style: React.CSSProperties = {
        ...styleSpace({ gap }),
    }
    if (color) style.color = `var(--theme-color-${color})`
    return (
        <button
            className={$.join(className, Style.Checkbox)}
            aria-checked={val}
            onClick={() => setVal(!val)}
            style={style}
        >
            {value ? <IconChecked /> : <IconUnchecked />}
            {children}
        </button>
    )
}
