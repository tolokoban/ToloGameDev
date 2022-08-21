import * as React from "react"
import Button from "@/ui/view/button"
import { TGDPainterAttribute } from "../../../../types"
import "./attribute-data-editor-view.css"

export interface AttributeDataEditorViewProps {
    className?: string
    attribute: TGDPainterAttribute
    value: number[]
    onChange(this: void, value: number[]): void
    onClose(this: void): void
}

export default function AttributeDataEditorView(
    props: AttributeDataEditorViewProps
) {
    const [error, setError] = React.useState<null | string>(null)
    const [content, setContent] = React.useState<string>(
        stringify(props.value, props.attribute.dim)
    )
    React.useEffect(() => setError(null), [content])
    const att = props.attribute
    const handleValidate = () => {
        try {
            const data = JSON.parse(`[${content}]`) as number[]
            const mod = att.dim * att.size
            if (data.length % mod !== 0) {
                setError(`${data.length} is no multiple of ${mod}!`)
            } else {
                props.onChange(data)
            }
        } catch (ex) {
            setError("Invalid syntax!")
        }
    }
    return (
        <div className={getClassNames(props)}>
            <div className="dialog theme-color-frame">
                <header className="theme-color-primary-dark">
                    <div className="name">{att.name}</div>
                    <div>dimension = {att.dim}</div>
                    <div>array size = {att.size}</div>
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

function getClassNames(props: AttributeDataEditorViewProps): string {
    const classNames = ["custom", "view-page-painter-AttributeDataEditorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

function stringify(data: number[], dim: number): string {
    const pieces: string[] = []
    for (let idx = 0; idx < data.length; idx++) {
        if (idx > 0) {
            pieces.push(", ")
            if (idx % dim === 0) pieces.push("\n")
        }
        const value = data[idx]
        pieces.push(`${value}`.padStart(12, " "))
    }
    return pieces.join("")
}
