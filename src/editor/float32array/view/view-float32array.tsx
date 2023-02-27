import * as React from "react"
import Button from "@/ui/view/Button"
import "./view-float32array.css"

export interface ViewFloat32arrayProps {
    className?: string
    caption: string
    columns: number
    value: number[]
    onValidate(value: number[]): void
    onCancel(): void
}

export default function ViewFloat32array(props: ViewFloat32arrayProps) {
    const [error, setError] = React.useState<null | string>(null)
    const [content, setContent] = React.useState<string>(
        stringify(props.value, props.columns)
    )
    React.useEffect(() => setError(null), [content])
    const handleValidate = () => {
        try {
            const data = JSON.parse(`[${content}]`) as number[]
            const cols = props.columns
            if (data.length % cols !== 0) {
                setError(`${data.length} is no multiple of ${cols}!`)
            } else {
                props.onValidate(data)
            }
        } catch (ex) {
            setError("Invalid syntax!")
        }
    }
    return (
        <div className={getClassNames(props)}>
            <div className="dialog theme-color-frame">
                <header className="theme-color-primary-dark">
                    <div className="name">{props.caption}</div>
                    <div>Float32[]</div>
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
                    <Button variant="text" onClick={props.onCancel}>
                        Cancel
                    </Button>
                    {error && <div className="theme-color-error">{error}</div>}
                    <Button onClick={handleValidate} enabled={!error}>
                        Validate
                    </Button>
                </footer>
            </div>
        </div>
    )
}

function getClassNames(props: ViewFloat32arrayProps): string {
    const classNames = ["custom", "editor-float32array-ViewFloat32array"]
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
