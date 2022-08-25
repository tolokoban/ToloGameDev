import * as React from "react"
import async from "../../../tools/async"
import Button from "@/ui/view/button"
import CodeEditor from "@/view/code-editor"
import Flex from "@/ui/view/flex"
import IconEdit from "@/ui/view/icons/edit"
import IconGear from "@/ui/view/icons/gear"
import InputInteger from "@/ui/view/input/integer"
import Label from "@/ui/view/label"
import Modal from "@/ui/modal"
import Options from "@/ui/view/options"
import PainterAttributeView from "./painter-attribute"
import PainterCompiler from "./painter-compiler"
import Preview from "../../preview"
import Runnable from "@/ui/view/runnable"
import { editUint16Array } from "../../../editor/uint16array"
import { getDataService } from "@/factory/data-service"
import { renderHeader } from "./render/header"
import { renderHelp } from "./render/help"
import { TGDPainterAttribute } from "@/types"
import { usePainterLoader } from "./hooks/painter-loader"
import { usePainterUpdater } from "./hooks/painter-updater"
import "./painter-page.css"

export interface PainterPageProps {
    className?: string
    id: number
    onClose(this: void): void
}

export default function PainterPage(props: PainterPageProps) {
    const refCompiler = React.useRef(new PainterCompiler())
    const updater = usePainterUpdater()
    const painter = updater.currentPainter
    const [editAttributeData, setEditAttributeData] = React.useState<
        null | string
    >(null)
    const [section, setShaderToShow] = React.useState("vert")
    const [elementsEditorVisible, setElementsEditorVisible] =
        React.useState(false)
    const handleCompile = () => refCompiler.current.compile(updater)
    usePainterLoader(props.id, updater)
    const handleCancel = async () => {
        const confirm =
            updater.currentPainter !== updater.stablePainter &&
            (await Modal.confirm(
                <div>
                    <div>
                        "You are about to revert all the changes you made for
                        these shaders."
                    </div>
                    <div>
                        This Painter will be automatically saved once compiled
                        successfully.
                    </div>
                </div>
            ))
        if (confirm) props.onClose()
    }
    const attribToEdit = painter?.attributes.find(
        (att) => att.name === editAttributeData
    )
    const handleEditElements = async () => {
        const data = await editUint16Array("Elements", painter.elements)
        updater.setElements(data)
    }
    const handleEditAttributeData = async (att: TGDPainterAttribute) => {
        const data = await editUint16Array(
            `Attribute: ${att.name}`,
            att.data,
            att.dim * att.size
        )
        updater.updateAttribute(att.name, { data })
    }
    return (
        <Runnable running={false}>
            <div className={getClassNames(props)}>
                {renderHeader(handleCancel, updater)}
                <main>
                    <div>
                        <Button
                            wide={true}
                            icon={IconGear}
                            label="Recompile painter to save it and refresh preview"
                            enabled={painter !== updater.stablePainter}
                            onClick={handleCompile}
                        />
                        {painter.error && (
                            <pre className="theme-color-error">
                                {painter.error}
                            </pre>
                        )}
                        <Preview painter={updater.stablePainter} />
                    </div>
                    <div>
                        <Options
                            wide={true}
                            options={{
                                vert: "Vertex Shader",
                                frag: "Fragment Shader",
                                data: "Data",
                            }}
                            value={section}
                            onChange={setShaderToShow}
                        />
                        <br />
                        {section === "vert" && (
                            <CodeEditor
                                language="glsl"
                                value={painter.shader.vert}
                                onChange={updater.setVertexShader}
                            />
                        )}
                        {section === "frag" && (
                            <CodeEditor
                                language="glsl"
                                value={painter.shader.frag}
                                onChange={updater.setFragmentShader}
                            />
                        )}
                        {section === "data" && (
                            <div>
                                {" "}
                                <h1>Data</h1>
                                <Flex wrap="wrap">
                                    <InputInteger
                                        label="Instances"
                                        size={4}
                                        value={painter.count.instance}
                                        onChange={updater.setInstanceCount}
                                    />
                                    <InputInteger
                                        label="Vertices"
                                        size={4}
                                        value={painter.count.vertex}
                                        onChange={updater.setVertexCount}
                                    />
                                    <InputInteger
                                        label="Elements"
                                        size={4}
                                        value={painter.count.element}
                                        onChange={updater.setElementCount}
                                    />
                                    <Button
                                        label="Edit elements"
                                        icon={IconEdit}
                                        onClick={handleEditElements}
                                    />
                                </Flex>
                                <div className="attributes">
                                    <Label value="Attribute" />
                                    <Label value="Divisor" />
                                    <Label value="Data (click to edit)" />
                                    {painter.attributes.map((att) => (
                                        <PainterAttributeView
                                            key={att.name}
                                            value={att}
                                            data={att.data}
                                            onChange={(upt) =>
                                                updater.updateAttribute(
                                                    att.name,
                                                    upt
                                                )
                                            }
                                            onClick={handleEditAttributeData}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {renderHelp()}
                    </div>
                </main>
            </div>
        </Runnable>
    )
}

function getClassNames(props: PainterPageProps): string {
    const classNames = ["custom", "view-page-PainterPage"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
