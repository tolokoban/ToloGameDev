import * as React from "react"
import ConstSelect from "@/view/const-select"
import { EMPTY_FUNC, WEBGL2 } from "@/tgd/constants"
import "./documentation-section.css"
import Button from "@/ui/view/Button/Button"
import Panel from "@/ui/view/Panel/Panel"

export interface DocumentationSectionProps {
    className?: string
}

export default function DocumentationSection(props: DocumentationSectionProps) {
    const [value, setValue] =
        React.useState<keyof typeof WEBGL2.depthFunc>("NOTEQUAL")
    return (
        <div className={getClassNames(props)}>
            <h1>Documentations</h1>
            <Panel display="flex" justifyContent="space-around">
                {link("https://docs.gl/es3/glTexParameter", "OpenGL ES 3.1")}
                {link(
                    "https://www.khronos.org/opengles/sdk/docs/manglsl/docbook4/",
                    "GLSL ES 3.0"
                )}
                {link("doc/webgl20-reference-guide.pdf", "WebGL 2 Quick Ref")}
            </Panel>
            <ConstSelect
                label="Depth Func"
                items={WEBGL2.depthFunc}
                value={value}
                onChange={setValue}
            />
        </div>
    )
}

function link(url: string, label: React.ReactNode) {
    return (
        <Button variant="outlined" onClick={() => window.open(url, "doc")}>
            {label}
        </Button>
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
