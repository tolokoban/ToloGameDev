import * as React from "react"
import { ViewWithValue } from "../types"

export function useChangeableValue<T>(
    props: ViewWithValue<T>
): [value: T, setValue: (value: T) => void] {
    const [value, setValue] = React.useState(props.value)
    React.useEffect(() => {
        setValue(props.value)
    }, [props.value])
    return [
        value,
        (v: T) => {
            setValue(v)
            props.onChange?.(v)
        },
    ]
}
