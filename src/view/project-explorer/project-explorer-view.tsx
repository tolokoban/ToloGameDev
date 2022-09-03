import * as React from "react"
import "./project-explorer-view.css"

export interface ProjectExplorerViewProps {
    className?: string
    tree: {
        [key: string]: Promise<string>
    }
}

export default function ProjectExplorerView(props: ProjectExplorerViewProps) {
    const filenames = Object.keys(props.tree)
    const [currentFilename, setCurrentFilename] = React.useState(filenames[0])
    const refContents = React.useRef<{ [filename: string]: string }>({})
    const [lastLoadedFile, setLastLoadedFile] = React.useState("")
    React.useEffect(() => {
        for (const filename of filenames) {
            const promise = props.tree[filename]
            if (promise)
                promise.then((content) => {
                    refContents.current[filename] = content
                    setLastLoadedFile(filename)
                })
        }
    }, [filenames, props.tree])
    return <div className={getClassNames(props)}></div>
}

function getClassNames(props: ProjectExplorerViewProps): string {
    const classNames = ["custom", "view-ProjectExplorerView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
