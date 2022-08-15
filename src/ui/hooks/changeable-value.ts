import * as React from "react"
import { ViewWithChangeableValue } from "./../view/types"

export function useChangeableValue<T>(
    props: ViewWithChangeableValue<T>
): [value: T, setValue: (value: T) => void] {
    const [value, setValue] = React.useState(props.value)
    React.useEffect(() => {
        setValue(props.value)
    }, [props.value])
    return [
        value,
        (v: T) => {
            setValue(v)
            if (props.onChange) props.onChange(v)
        },
    ]
}
