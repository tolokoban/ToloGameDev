import Button from "@/ui/view/Button"
import CodeEditor from "@/view/code-editor"
import Panel from "@/ui/view/Panel"
import GlslSnippetView from "@/view/input/glsl-snippet"
import Help from "./help"
import IconBook from "@/ui/view/icons/IconBook"
import IconHelp from "@/ui/view/icons/IconHelp"
import Options from "@/ui/view/Options"
import React from "react"
import { PainterUpdater } from "../../hooks/painter-updater"
import { useModal } from "@/ui/modal"

type ShaderType = "vert" | "frag"

export default function DataSection(props: { updater: PainterUpdater }) {
    const modal = useModal()
    const [type, setType] = React.useState<ShaderType>("vert")
    const { updater } = props
    const code =
        type === "vert"
            ? updater.currentPainter.shader.vert
            : updater.currentPainter.shader.frag
    const setCode =
        type === "vert" ? updater.setVertexShader : updater.setFragmentShader
    return (
        <div>
            <Panel
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                gap="1em"
            >
                <Options<ShaderType>
                    label="Type de shader"
                    options={{
                        vert: "Vertex Shader",
                        frag: "Fragment Shader",
                    }}
                    value={type}
                    onChange={setType}
                />
                <Button
                    icon={IconBook}
                    onClick={() => modal.info(<GlslSnippetView />)}
                >
                    Bibliothèque
                </Button>
                <Button icon={IconHelp} variant="text" onClick={handleHelp}>
                    Doc
                </Button>
            </Panel>
            <CodeEditor language="glsl" value={code} onChange={setCode} />
            <Help />
        </div>
    )
}

function handleHelp() {
    window.open(
        "https://www.khronos.org/opengles/sdk/docs/manglsl/docbook4/",
        "_HELP_"
    )
}
