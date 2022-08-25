import * as React from "react"
import Button from "@/ui/view/button"
import { assertNumber } from "../../../guards"
import "./view-uint16array.css"

export interface ViewUint16arrayProps {
    className?: string
    caption: string
    columns: number
    value: number[]
    onValidate(value: number[]): void
    onCancel(): void
}

export default function ViewUint16array(props: ViewUint16arrayProps) {
    const [error, setError] = React.useState<null | string>(null)
    const [content, setContent] = React.useState<string>(
        stringify(props.value, props.columns)
    )
    React.useEffect(() => setError(null), [content])
    const handleValidate = () => {
        try {
            const data = JSON.parse(`[${content}]`) as number[]
            if (!Array.isArray(data)) throw Error("Not an array!")
            for (const elem of data) {
                try {
                    assertNumber(elem, "Element")
                    if (elem < 0) throw Error("Element cannot be negative!")
                    if (Math.floor(elem) !== elem)
                        throw Error("Element must be an integer!")
                } catch (ex) {
                    if (ex instanceof Error) {
                        setError(ex.message)
                        return
                    } else {
                        throw ex
                    }
                }
            }
            props.onValidate(data)
        } catch (ex) {
            console.error(ex)
            setError("Invalid syntax!")
        }
    }
    return (
        <div className={getClassNames(props)}>
            <div className="dialog theme-color-frame">
                <header className="theme-color-primary-dark">
                    <div className="name">{props.caption}</div>
                    <div>Uint16[]</div>
                </header>
                <main>
                    <textarea
                        className="theme-color-input"
                        autoFocus={true}
                        value={content}
                        onChange={(evt) => setContent(evt.target.value)}
                    ></textarea>
                </main>
                <footer className="theme-color-section">
                    <Button
                        label="Cancel"
                        flat={true}
                        onClick={props.onCancel}
                    />
                    {error && <div className="theme-color-error">{error}</div>}
                    <Button
                        label="Validate"
                        onClick={handleValidate}
                        enabled={!error}
                    />
                </footer>
            </div>
        </div>
    )
}

function getClassNames(props: ViewUint16arrayProps): string {
    const classNames = ["custom", "editor-uint16array-ViewUInt16array"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function stringify(data: number[], columns: number): string {
    const pieces: string[] = []
    for (let idx = 0; idx < data.length; idx++) {
        if (idx > 0) {
            pieces.push(", ")
            if (idx % columns === 0) pieces.push("\n")
        }
        const value = data[idx]
        pieces.push(`${value}`.padStart(12, " "))
    }
    return pieces.join("")
}
