import * as React from "react"
import Label from "../label"
import { ViewWithChangeableValue } from "../types"
import "./combo-view.css"

export type ComboItems<T> = Array<[key: T, element: React.ReactNode]>

export type ComboViewProps<T> = ViewWithChangeableValue<T> & {
    className?: string
    wide?: boolean
    label?: string
    error?: string
    items: ComboItems<T>
}

export default function ComboView<T = string>(props: ComboViewProps<T>) {
    const { error, label, items, value, onChange } = props
    const id = React.useId()
    const [open, setOpen] = React.useState(false)
    const selected: React.ReactNode = findSelected(value, items)
    React.useEffect(() => {
        if (!open) return

        const handleKeydown = (evt: KeyboardEvent) => {
            if (evt.key === "Escape") {
                evt.stopImmediatePropagation()
                evt.preventDefault()
                setOpen(false)
            }
        }
        window.document.addEventListener("keydown", handleKeydown, true)
        return () =>
            window.document.removeEventListener("keydown", handleKeydown, true)
    }, [open])
    return (
        <>
            <div className={getClassNames(props)} tabIndex={0}>
                <Label
                    value={error ?? label}
                    target={id}
                    error={error ? true : false}
                />
                <button
                    className="flex theme-shadow-button"
                    onClick={() => setOpen(true)}
                >
                    <div className="theme-color-input">{selected}</div>
                    <div className="theme-color-primary">▾</div>
                </button>
                <Label className="hide" value={label} target={id} />
            </div>
            {open && (
                <div
                    className="ui-view-ComboView-overlay"
                    onClick={() => setOpen(false)}
                >
                    <div className="container theme-color-screen">
                        {label && (
                            <header className="theme-color-primary-dark">
                                {label}
                            </header>
                        )}
                        <main>
                            {items
                                .filter(([key]) => key !== value)
                                .map(([key, item]) => (
                                    <button
                                        key={`${key}`}
                                        tabIndex={0}
                                        onClick={() => {
                                            setOpen(false)
                                            onChange(key)
                                        }}
                                    >
                                        {item}
                                    </button>
                                ))}
                        </main>
                    </div>
                </div>
            )}
        </>
    )
}

function getClassNames<T>(props: ComboViewProps<T>): string {
    const classNames = ["custom", "ui-view-ComboView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.wide === true) classNames.push("wide")

    return classNames.join(" ")
}

function findSelected<T>(
    value: T,
    items: [key: T, element: React.ReactNode][]
): React.ReactNode {
    const item = items.find((item) => {
        const [key] = item
        return key === value
    })
    if (!item) return null

    const [_key, node] = item
    return node
}
