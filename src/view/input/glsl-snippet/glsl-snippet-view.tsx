import * as React from "react"

import "./glsl-snippet-view.css"

export interface GlslSnippetViewProps {
    className?: string
}

export default function GlslSnippetView(props: GlslSnippetViewProps) {
    return <div className={getClassNames(props)}></div>
}

function getClassNames(props: GlslSnippetViewProps): string {
    const classNames = ["custom", "view-input-GlslSnippetView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
