export interface FolderType {
    type: "folder"
    name: string
    children: FileOrFolder[]
}

export interface FileType {
    type: "file"
    name: string
}

export type FileOrFolder = FileType | FolderType
