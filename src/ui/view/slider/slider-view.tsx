import * as React from "react"
import Label from "../label"
import PointerWatcher from "../../watcher/pointer"
import { PointerWatcherEvent } from "../../watcher/pointer/pointer-watcher"
import { useRefId } from "../../hooks/id"
import "./slider-view.css"

/**
 * @see https://material.io/components/sliders
 */

export interface SliderViewProps {
    className?: string
    label?: string
    /** If defined, displayed at the right of the slider. */
    text?: string | number
    wide?: boolean
    min?: number
    max?: number
    value: number
    steps?: number
    onChange(value: number): void
}

export default function SliderView(props: SliderViewProps) {
    const refId = useRefId()
    const { onChange } = props
    const refTrack = React.useRef<HTMLDivElement | null>(null)
    const refButton = React.useRef<HTMLButtonElement | null>(null)
    const min = props.min ?? 0
    const max = props.max ?? 100
    const steps = Math.max(1e-6, props.steps ?? 1)
    const [value, setValue] = React.useState(clamp(props.value, min, max))
    const update = React.useCallback(
        (percent: number) => {
            const v = min + (max - min) * percent
            const step = min + steps * Math.floor(0.5 + (v - min) / steps)
            const newValue = clamp(step, min, max)
            setValue(newValue)
            onChange(newValue)
        },
        [max, min, onChange, steps]
    )
    const handleClick = (evt: React.MouseEvent<HTMLDivElement>) => {
        const div = refTrack.current
        if (!div) return

        const rect = div.getBoundingClientRect()
        const percent = (evt.clientX - rect.left) / rect.width
        update(percent)
    }
    useGestures(
        refTrack,
        refButton,
        update,
        steps,
        value,
        max,
        min,
        setValue,
        onChange
    )
    if (min >= max) {
        return (
            <div>
                ERROR! min = {min} {" > "} max = {max}
            </div>
        )
    }
    const percent = `${(100 * (value - min)) / (max - min)}%`
    return (
        <div className={getClassNames(props)}>
            <Label value={props.label} target={refId.current} />
            <div
                className="input"
                id={refId.current}
                ref={refTrack}
                tabIndex={0}
                onClick={handleClick}
            >
                <div className="track"></div>
                <div className="bar" style={{ width: percent }}></div>
                <button
                    className="thumb"
                    ref={refButton}
                    style={{ left: percent }}
                ></button>
            </div>
            {props.text && <div className="text">{props.text}</div>}
        </div>
    )
}

function useGestures(
    refTrack: React.MutableRefObject<HTMLDivElement | null>,
    refButton: React.MutableRefObject<HTMLButtonElement | null>,
    update: (percent: number) => void,
    steps: number,
    value: any,
    max: number,
    min: number,
    setValue: React.Dispatch<any>,
    onChange: (value: number) => void
) {
    React.useEffect(() => {
        const div = refTrack.current
        const button = refButton.current
        if (!div || !button) return

        const manager = new PointerWatcher({
            onDrag: (evt: PointerWatcherEvent) => {
                const x = evt.absX
                const rectDiv = div.getBoundingClientRect()
                const rectButton = button.getBoundingClientRect()
                const percent =
                    (x - rectButton.width / 2 - rectDiv.left) / rectDiv.width
                update(percent)
            },
        })
        const handleKey = (evt: KeyboardEvent) => {
            let shift = 0
            switch (evt.key) {
                case "ArrowLeft":
                    shift = -steps
                    break
                case "ArrowRight":
                    shift = +steps
                    break
                case "Home":
                    shift = -value
                    break
                case "End":
                    shift = max
                    break
            }
            if (evt.ctrlKey) shift *= 10
            if (shift !== 0) {
                const newValue = clamp(value + shift, min, max)
                setValue(newValue)
                onChange(newValue)
            }
        }
        button.addEventListener("keydown", handleKey)
        return () => manager.detach()
    }, [refTrack, refButton, max, min, steps, onChange, update, value])
}

function getClassNames(props: SliderViewProps): string {
    const classNames = ["custom", "ui-view-SliderView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.wide === true) classNames.push("wide")

    return classNames.join(" ")
}

function clamp(value: number, min: number, max: number): any {
    return Math.max(Math.min(value, max), min)
}
