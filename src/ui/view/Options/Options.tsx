import * as React from "react"
import { useChangeableValue } from "../../hooks/changeable-value"
import { ViewWithValue } from "../../types"
import Label from "../Label"
import Touchable from "../Touchable"
import Styles from "./Options.module.css"

export type OptionsViewProps<T extends string> = ViewWithValue<T> & {
    className?: string
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
            <Label value={label}>
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
            </Label>
        </div>
    )
}

function getClassNames<T extends string>(props: OptionsViewProps<T>): string {
    const classNames = [Styles.Options]
    if (typeof props.className === "string") classNames.push(props.className)
    if (props.wide === true) classNames.push(Styles.OptionsWide)

    return classNames.join(" ")
}
