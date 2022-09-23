import * as React from "react"
import ConstSelect from "@/view/const-select"
import { EMPTY_FUNC, WEBGL2 } from "@/tgd/constants"
import "./documentation-section.css"

export interface DocumentationSectionProps {
    className?: string
}

export default function DocumentationSection(props: DocumentationSectionProps) {
    const [value, setValue] =
        React.useState<keyof typeof WEBGL2.depthFunc>("NOTEQUAL")
    return (
        <div className={getClassNames(props)}>
            <h1>Documentations</h1>
            <ul>
                <li>
                    <a href="https://docs.gl/es3/glTexParameter" target="doc">
                        OpenGL ES 3.1
                    </a>
                </li>
            </ul>
            <ConstSelect
                label="Depth Func"
                items={WEBGL2.depthFunc}
                value={value}
                onChange={setValue}
            />
        </div>
    )
}

function getClassNames(props: DocumentationSectionProps): string {
    const classNames = [
        "custom",
        "view-page-painter-section-DocumentationSection",
        "theme-color-screen",
        "theme-shadow-dialog",
    ]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
