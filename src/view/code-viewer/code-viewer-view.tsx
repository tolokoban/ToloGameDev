import * as React from "react"
import Prism from "prismjs"
import { getGrammarForLanguage } from "@/tools/grammar"
import "./code-viewer-view.css"
import { useModal } from "@/ui/modal"

export interface CodeViewerViewProps {
    className?: string
    value: string
    language: string
}

export default function CodeViewerView(props: CodeViewerViewProps) {
    const modal = useModal()
    const refCode = React.useRef<null | HTMLElement>(null)
    React.useEffect(() => {
        window.setTimeout(() => {
            const code = refCode.current
            if (!code) return

            const html = Prism.highlight(
                props.value,
                getGrammarForLanguage(props.language),
                props.language
            )
            code.innerHTML = html
        }, 100)
    }, [props.value, props.language])
    const handleDoubleClick = () => {
        navigator.clipboard.writeText(props.value).then(() => {
            modal.info("This code has been copied to the clipboard!")
        })
    }
    return (
        <div className={getClassNames(props)} onDoubleClick={handleDoubleClick}>
            <pre>
                <code
                    ref={refCode}
                    className={`language-${props.language}`}
                ></code>
            </pre>
        </div>
    )
}

function getClassNames(props: CodeViewerViewProps): string {
    const classNames = ["custom", "view-CodeViewerView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
