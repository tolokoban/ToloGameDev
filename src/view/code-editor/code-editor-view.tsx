import * as React from "react"
import Editor from "react-simple-code-editor"
import Prism from "prismjs"
import { getGrammarForLanguage } from "@/tools/grammar"
import "./code-editor-view.css"

export interface CodeEditorViewProps {
    className?: string
    value: string
    onChange(value: string): void
    language: string
}

export default function CodeEditorView(props: CodeEditorViewProps) {
    const [value, setValue] = React.useState(props.value)
    React.useEffect(() => setValue(props.value), [props.value])
    return (
        <div className={getClassNames(props)}>
            <Editor
                value={value}
                onValueChange={(v) => {
                    setValue(v)
                    props.onChange(v)
                }}
                highlight={(code) =>
                    Prism.highlight(
                        code,
                        getGrammarForLanguage(props.language),
                        props.language
                    )
                }
            />
        </div>
    )
}

function getClassNames(props: CodeEditorViewProps): string {
    const classNames = ["custom", "view-CodeEditorView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
