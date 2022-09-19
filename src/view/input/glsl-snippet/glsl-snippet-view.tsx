import * as React from "react"
import ButtonGlslSnippet from "./button"
import CodeViewer from "@/view/code-viewer"
import { assertObject, assertString } from "../../../guards"
import "./glsl-snippet-view.css"

export interface GlslSnippetViewProps {
    className?: string
}

export default function GlslSnippetView(props: GlslSnippetViewProps) {
    const [directory, setDirectory] = React.useState<Directory>({})
    const [code, setCode] = React.useState("")
    const [selectedSnippets, setSelectedSnippets] = React.useState<string[]>([])
    const handleSwapSnippet = (selected: boolean, key: string) => {
        const snippets = selectedSnippets.filter((name) => name !== key)
        if (selected) {
            setSelectedSnippets([key, ...snippets])
        } else {
            setSelectedSnippets(snippets)
        }
    }
    React.useEffect(() => {
        fetchDirectory().then(setDirectory)
    }, [])
    React.useEffect(() => {
        const action = async () => {
            const blocks: string[] = []
            setCode(
                "// Clicker sur les boutons à gauche pour\n// ajouter des fonctions utiles."
            )
            for (const key of selectedSnippets) {
                const content = await fetchText(`lib/glsl-function/${key}.glsl`)
                blocks.push(content)
                const newCode = blocks.map((text) => text.trim()).join("\n")
                setCode(newCode)
                navigator.clipboard.writeText(newCode)
            }
        }
        void action()
    }, [selectedSnippets])
    return (
        <div className={getClassNames(props)}>
            <div className="directory">
                {Object.keys(directory).map((key) => (
                    <ButtonGlslSnippet
                        key={key}
                        label={directory[key].name}
                        value={selectedSnippets.includes(key)}
                        onChange={(value) => handleSwapSnippet(value, key)}
                    />
                ))}
            </div>
            <CodeViewer language="glsl" value={code} />
        </div>
    )
}

function getClassNames(props: GlslSnippetViewProps): string {
    const classNames = ["custom", "view-input-GlslSnippetView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

async function fetchText(url: string): Promise<string> {
    const response = await fetch(url)
    return (await response.text()).trim()
}

async function fetchJSON(url: string): Promise<unknown> {
    const text = await fetchText(url)
    try {
        return JSON.parse(text)
    } catch (ex) {
        console.error("Invalid JSON format:", text)
        console.error(ex)
        return null
    }
}

interface Directory {
    [key: string]: {
        name: string
    }
}

async function fetchDirectory(): Promise<Directory> {
    const data = await fetchJSON("lib/glsl-function/@.json")
    assertObject(data)
    for (const key of Object.keys(data)) {
        const item = data[key]
        assertObject(item, `data["${key}"]`)
        assertString(item.name, `data["${key}"].name`)
    }
    return data as Directory
}
