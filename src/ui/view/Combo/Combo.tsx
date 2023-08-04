import Theme from "@/ui/theme"
import React from "react"
import { ViewWithValue } from "../../types"
import Label from "../Label"
import Style from "./Combo.module.css"

const $ = Theme.classNames

export type ComboItems<T> = Array<[key: T, element: React.ReactNode]>

export type ComboProps<T> = ViewWithValue<T> & {
    className?: string
    wide?: boolean
    label?: string
    hideLabel?: boolean
    error?: string
    items: ComboItems<T>
}

export default function Combo<T = string>({
    error,
    label,
    items,
    value,
    hideLabel = false,
    onChange,
    className,
}: ComboProps<T>) {
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
            <div className={$.join(className, Style.Combo)} tabIndex={0}>
                <Label
                    value={error ?? (hideLabel ? undefined : label)}
                    color={error ? "error" : undefined}
                >
                    <button
                        className="flex theme-shadow-button"
                        onClick={() => setOpen(true)}
                    >
                        <div className="theme-color-input">{selected}</div>
                        <div className="theme-color-primary">▾</div>
                    </button>
                </Label>
            </div>
            {open && (
                <div
                    className={Style.ComboOverlay}
                    onClick={() => setOpen(false)}
                >
                    <div className="container theme-color-screen">
                        {label && (
                            <header className="theme-color-primary-dark">
                                {label}
                            </header>
                        )}
                        <main>
                            {items.map(([key, item]) => (
                                <button
                                    key={`${key}`}
                                    style={
                                        key !== value
                                            ? {}
                                            : {
                                                  fontWeight: "bolder",
                                                  color: "var(--theme-color-on-secondary-9)",
                                                  background:
                                                      "var(--theme-color-secondary-9)",
                                              }
                                    }
                                    tabIndex={0}
                                    onClick={() => {
                                        setOpen(false)
                                        onChange?.(key)
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
