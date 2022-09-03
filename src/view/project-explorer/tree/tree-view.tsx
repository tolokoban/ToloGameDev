import * as React from "react"
import "./tree-view.css"

export interface TreeViewProps {
    className?: string
    filenames: string[]
    onClick(this: void, filename: string): void
}

export default function TreeView(props: TreeViewProps) {
    return <div className={getClassNames(props)}></div>
}

function getClassNames(props: TreeViewProps): string {
    const classNames = ["custom", "view-projectExplorer-TreeView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
