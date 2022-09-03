import * as React from "react"
import { FileOrFolder, FileType, FolderType } from "../types"
import "./folder-view.css"

export interface FolderViewProps {
    className?: string
    root: string
    filesOrFolders: FileOrFolder[]
    onFileClick(this: void, path: string): void
}

export default function FolderView(props: FolderViewProps) {
    const folders = props.filesOrFolders.filter(
        (item) => item.type === "folder"
    ) as FolderType[]
    const files = props.filesOrFolders.filter(
        (item) => item.type === "file"
    ) as FileType[]
    return (
        <div className={getClassNames(props)}>
            {folders.map((folder) => (
                <>
                    <div className="folder">{folder.name}</div>
                    <FolderView
                        root={`${props.root}/${folder.name}`}
                        filesOrFolders={folder.children}
                        onFileClick={props.onFileClick}
                    />
                </>
            ))}
            {files.map((file) => (
                <div
                    className="file"
                    onClick={() =>
                        props.onFileClick(`${props.root}/${file.name}`)
                    }
                >
                    {file.name}
                </div>
            ))}
        </div>
    )
}

function getClassNames(props: FolderViewProps): string {
    const classNames = ["custom", "view-projectExplorer-tree-FolderView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
