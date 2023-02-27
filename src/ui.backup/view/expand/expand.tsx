import * as React from "react"
import MinusOIcon from "../icons/minus-o"
import PlusOIcon from "../icons/plus-o"
import Touchable from "../touchable"
import { Icon } from "../icons/generic"
import { useChangeableValue } from "../../hooks/changeable-value"
import { View, ViewWithChangeableValue } from "../types"
import "./expand.css"

export type IExpandProps = View &
    ViewWithChangeableValue<boolean> & {
        label: string
        children: React.ReactNode
        expandedIcon?: Icon
        collapsedIcon?: Icon
    }

const ICON_SIZE = "2rem"

export default function Expand(props: IExpandProps) {
    const [value, setValue] = useChangeableValue(props)
    const handleToggleValue = () => {
        setValue(!value)
        if (props.onChange) props.onChange(!value)
    }

    const classes = ["custom", "tfw-view-Expand", props.className ?? ""]

    return (
        <div className={classes.join(" ")} tabIndex={0} aria-expanded={value}>
            <Touchable onClick={handleToggleValue}>
                <div className="head">
                    <div className="icons">
                        {(props.collapsedIcon ?? PlusOIcon)()}
                        {(props.expandedIcon ?? MinusOIcon)()}
                    </div>
                    <div>{props.label}</div>
                </div>
            </Touchable>
            <div className="body">{props.children}</div>
        </div>
    )
}
