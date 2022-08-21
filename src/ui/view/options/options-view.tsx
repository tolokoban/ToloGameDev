import * as React from "react"
import Label from "../label"
import Touchable from "../touchable"
import { useChangeableValue } from "../../hooks/changeable-value"
import { View, ViewWithChangeableValue } from "../types"
import "./options-view.css"

export type OptionsViewProps<T extends string> = View &
    ViewWithChangeableValue<T> & {
        label?: string
        wide?: boolean
        options: { [key: string]: string | JSX.Element }
    }

export default function OptionsView<T extends string>(
    props: OptionsViewProps<T>
) {
    const { label, options } = props
    const [value, setValue] = useChangeableValue(props)
    return (
        <div className={getClassNames(props)}>
            <Label value={label} />
            <div className="options theme-shadow-button">
                {Object.keys(options).map((key) =>
                    key === value ? (
                        <div
                            className="button selected theme-color-accent-light"
                            key={key}
                        >
                            {options[key]}
                        </div>
                    ) : (
                        <Touchable
                            className="button not-selected theme-color-primary"
                            key={key}
                            onClick={() => setValue(key as T)}
                        >
                            {options[key]}
                        </Touchable>
                    )
                )}
            </div>
        </div>
    )
}

function getClassNames<T extends string>(props: OptionsViewProps<T>): string {
    const classNames = ["custom", "view", "ui-view-OptionsView"]
    if (typeof props.className === "string") classNames.push(props.className)
    if (props.wide === true) classNames.push("wide")

    return classNames.join(" ")
}
