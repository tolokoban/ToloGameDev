import * as React from "react"
import StarIcon from "../icons/star"
import { getSizeStyle } from "../_common"
import { Icon } from "../icons/generic"
import { useChangeableValue } from "../../hooks/changeable-value"
import { useRefId } from "../../hooks/id"
import "./rating-view.css"
import {
    View,
    ViewWithValue,
    ViewWithColor,
    ViewWithName,
    ViewWithSize,
} from "../types"

const EMPTY_FUNCTION = () => {}

export type RatingViewProps = View &
    ViewWithValue<number> &
    ViewWithSize &
    ViewWithColor &
    ViewWithName & {
        /** Number of stars to display. Default to 5. */
        max?: number
        readOnly?: boolean
        icon?: Icon
    }

const DEFAULT_STAR_COLOR = "#faaf00"

export default function RatingView(propsWithOptions: RatingViewProps) {
    const props = addDefaultValue(propsWithOptions)
    const { max, color, name, icon } = props
    const [value, setValue] = useChangeableValue(props)
    const refId = useRefId()
    return (
        <span
            className={getClassNames(props)}
            tabIndex={0}
            style={{
                ...getSizeStyle(props.size),
            }}
        >
            {range(max).map((star) => {
                const starId = `${refId.current}-${star}`
                return (
                    <>
                        <label htmlFor={starId}>
                            <span>
                                {icon({
                                    color,
                                    type: "outlined",
                                })}
                            </span>
                            <span
                                className="absolute"
                                style={{
                                    width: computeStarWidth(star, value, props),
                                }}
                            >
                                {icon({
                                    color,
                                    type: props.readOnly ? "bold" : "dual",
                                })}
                            </span>
                            <span className="hidden">
                                {star} Star{star > 1 ? "s" : ""}
                            </span>
                        </label>
                        <input
                            className="hidden"
                            type="radio"
                            name={name}
                            value={`${star}`}
                            checked={star > value - 1 && star <= value}
                            onChange={(evt) => {
                                if (evt.target.checked) setValue(star)
                            }}
                            id={starId}
                        ></input>
                    </>
                )
            })}
        </span>
    )
}

function getClassNames(props: RatingViewProps): string {
    const classNames = ["custom", "ui-view-RatingView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.readOnly) classNames.push("read-only")

    return classNames.join(" ")
}

function addDefaultValue(props: RatingViewProps): Required<RatingViewProps> {
    return {
        className: "",
        max: 5,
        color: DEFAULT_STAR_COLOR,
        readOnly: false,
        name: `RatingView-${Math.random()}`,
        size: "medium",
        icon: StarIcon,
        onChange: EMPTY_FUNCTION,
        ...props,
    }
}

function range(max: number): number[] {
    const arr: number[] = []
    for (let i = 0; i < max; i++) arr.push(i + 1)
    return arr
}

function computeStarWidth(
    star: number,
    value: number,
    props: Required<RatingViewProps>
): string {
    const base = Math.floor(value)
    if (star <= base) return "100%"
    if (star > base + 1) return "0%"
    const percent = 100 * (value - base)
    return `${percent.toFixed(0)}%`
}
