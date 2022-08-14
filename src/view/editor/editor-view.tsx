import * as React from "react"
import "./editor-view.css"

export interface EditorViewProps {
    className?: string
    value: string
}

export default function EditorView(props: EditorViewProps) {
    const attachEvents = (textarea: HTMLTextAreaElement) => {
        textarea.addEventListener("input", () => {
            textarea.style.height = "auto"
            textarea.style.height = `${textarea.scrollHeight}px`
        })
        textarea.style.height = `${textarea.scrollHeight}px`
        textarea.style.overflowY = "hidden"
    }
    return (
        <div className={getClassNames(props)}>
            <div>
                <textarea ref={attachEvents}>{props.value}</textarea>
                <div>Hello world!</div>
            </div>
        </div>
    )
}

function getClassNames(props: EditorViewProps): string {
    const classNames = ["custom", "view-EditorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
