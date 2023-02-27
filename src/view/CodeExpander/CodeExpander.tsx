import React from "react"
import Theme from "@/ui/theme"
import Style from "./CodeExpander.module.css"
import CodeViewer from "../code-viewer"
import IconShow from "@/ui/view/icons/IconShow"
import { CodeBlock } from "@/factory/code/types"
import { linearize } from "@/factory/code/linearize"

const $ = Theme.classNames

export interface CodeExpanderProps {
    className?: string
    language?: string
    label?: string
    children: CodeBlock
}

export default function CodeExpander({
    className,
    language = "ts",
    label = "Show code",
    children,
}: CodeExpanderProps) {
    return (
        <details className={$.join(className, Style.CodeExpander)}>
            <summary>
                <div>
                    {label} <IconShow />
                </div>
            </summary>
            <CodeViewer language={language} value={linearize(children)} />
        </details>
    )
}
