import { FileOrFolder, FolderType } from "./types"

export function makeStructure(filenames: string[]): FileOrFolder[] {
    const root: FolderType = {
        type: "folder",
        name: "<ROOT>",
        children: [],
    }
    const paths = filenames.sort().map((filename) => filename.split("/"))
    for (const path of paths) {
        let cursor = root
        for (let i = 0; i < path.length - 1; i++) {
            const item = path[i]
            cursor = findOrAddFolder(cursor, item)
        }
        const name = path.at(-1)
        if (!name) throw Error(`Fatal error in path "${JSON.stringify(path)}"!`)
        cursor.children.push({ type: "file", name })
    }
    return root.children
}

function findOrAddFolder(root: FolderType, name: string): FolderType {
    for (const item of root.children) {
        if (item.name === name && item.type === "folder") return item
    }
    const newFolder: FolderType = {
        type: "folder",
        name,
        children: [],
    }
    root.children.push(newFolder)
    return newFolder
}
