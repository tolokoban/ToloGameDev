import Button from "@/ui/view/button"
import CodeEditor from "@/view/code-editor"
import Flex from "@/ui/view/flex"
import GlslSnippetView from "@/view/input/glsl-snippet"
import Help from "./help"
import IconBook from "@/ui/view/icons/book"
import IconHelp from "@/ui/view/icons/help"
import Modal from "@/ui/modal"
import Options from "@/ui/view/options"
import React from "react"
import { PainterUpdater } from "../../hooks/painter-updater"

type ShaderType = "vert" | "frag"

export default function DataSection(props: { updater: PainterUpdater }) {
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
            <Flex justifyContent="space-between" alignItems="center" gap="1em">
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
                    label="Bibliothèque"
                    icon={IconBook}
                    onClick={handleLibrary}
                />
                <Button
                    label="Doc"
                    icon={IconHelp}
                    flat={true}
                    onClick={handleHelp}
                />
            </Flex>
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

function handleLibrary() {
    Modal.info(<GlslSnippetView />)
}
