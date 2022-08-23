import * as React from "react"
import Button from "@/ui/view/button"
import "./elements-editor-view.css"

export interface ElementsEditorViewProps {
    className?: string
    value: number[]
    onChange(this: void, value: number[]): void
    onClose(this: void): void
}

export default function ElementsEditorView(props: ElementsEditorViewProps) {
    const [error, setError] = React.useState<null | string>(null)
    const [content, setContent] = React.useState<string>(stringify(props.value))
    React.useEffect(() => setError(null), [content])
    const handleValidate = () => {
        try {
            const data = JSON.parse(`[${content}]`) as number[]
            if (!Array.isArray(data)) throw Error("Array syntax is invalid!")

            for (const element of data) {
                if (typeof element !== "number")
                    throw Error(`This index is not a number: ${element}`)
                if (element < 0)
                    throw Error("No index can be lesser than zero!")
                if (Math.floor(element) !== element) {
                    throw Error("Indexes must be integers!")
                }
            }
            props.onChange(data)
        } catch (ex) {
            setError("Invalid syntax!")
        }
    }
    return (
        <div className={getClassNames(props)}>
            <div className="dialog theme-color-frame">
                <header className="theme-color-primary-dark">
                    <div className="name">Elements</div>
                    <div>(attributes' indexes)</div>
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
                        onClick={props.onClose}
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

function getClassNames(props: ElementsEditorViewProps): string {
    const classNames = ["custom", "view-page-painter-ElementsEditorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function stringify(data: number[], dim = 3): string {
    const pieces: string[] = []
    for (let idx = 0; idx < data.length; idx++) {
        if (idx > 0) {
            pieces.push(", ")
            if (idx % dim === 0) pieces.push("\n")
        }
        const value = data[idx]
        pieces.push(`${value}`.padStart(5, " "))
    }
    return pieces.join("")
}
