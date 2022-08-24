import * as React from "react"
import AttributeDataEditor from "./attribute-data-editor"
import Button from "@/ui/view/button"
import CodeEditor from "@/view/code-editor"
import ElementsEditor from "./elements-editor"
import Flex from "@/ui/view/flex"
import IconEdit from "@/ui/view/icons/edit"
import IconGear from "@/ui/view/icons/gear"
import InputInteger from "@/ui/view/input/integer"
import Label from "@/ui/view/label"
import Modal from "@/ui/modal"
import Options from "@/ui/view/options"
import PainterAttributeView from "./painter-attribute"
import PainterCompiler from "@/tools/webgl/painter-compiler"
import Preview from "../../preview"
import Runnable from "@/ui/view/runnable"
import { getDataService } from "@/factory/data-service"
import { renderHeader } from "./render/header"
import { renderHelp } from "./render/help"
import { TGDPainter, TGDPainterAttribute, TGDPainterData } from "@/types"
import { usePainterLoader } from "./hooks/use-painter-loader"
import "./painter-page.css"

export interface PainterPageProps {
    className?: string
    id: number
    onClose(this: void): void
}

export default function PainterPage(props: PainterPageProps) {
    const refCompiler = React.useRef(new PainterCompiler())
    const [editAttributeData, setEditAttributeData] = React.useState<
        null | string
    >(null)
    const [section, setShaderToShow] = React.useState("vert")
    const [error, setError] = React.useState<null | string>(null)
    const [busy, setBusy] = React.useState(true)
    const [painter, setPainter] = React.useState<TGDPainter | null>(null)
    const [validPainter, setValidPainter] = React.useState(painter)
    const [elementsEditorVisible, setElementsEditorVisible] =
        React.useState(false)
    const handleCompile = () => {
        if (!painter) return

        const err = refCompiler.current.compile(painter)
        setError(err)
        const newPainter = { ...painter }
        setPainter(newPainter)
        setValidPainter(newPainter)
        void getDataService().painter.update(newPainter)
    }
    const update = (value: Partial<TGDPainter>) => {
        if (!painter) return

        const newPainter = { ...painter, ...value }
        setPainter(newPainter)
    }
    const updatePreviewData = (value: Partial<TGDPainterData>) => {
        if (!painter) return

        setPainter({
            ...painter,
            preview: {
                data: {
                    ...painter.preview.data,
                    ...value,
                },
            },
        })
    }
    usePainterLoader(props, setBusy, setPainter, setValidPainter)
    const handleCancel = async () => {
        const confirm = await Modal.confirm(
            "You are about to revert all the changes you made for these shaders"
        )
        if (confirm) props.onClose()
    }
    const handleSave = async () => {
        const svc = getDataService()
        if (painter) {
            await Modal.wait("Saving...", svc.painter.update(painter))
        }
        props.onClose()
    }
    const attribToEdit = painter?.attributes.find(
        (att) => att.name === editAttributeData
    )
    const handleAttributeDataChange = (data: number[]) => {
        setEditAttributeData(null)
        if (!attribToEdit || !painter) return

        const newPainter = { ...painter }
        newPainter.preview.data.attributes[attribToEdit.name] = data
        setPainter(newPainter)
    }
    const handleElementsChange = (data: number[]) => {
        setElementsEditorVisible(false)
        if (!painter) return

        const newPainter = { ...painter }
        newPainter.preview.data.elements = data
        setPainter(newPainter)
    }
    const handleUpdateAttribute = (attribute: TGDPainterAttribute) => {
        if (!painter) return

        const idx = painter.attributes.findIndex(
            (att) => att.name === attribute.name
        )
        if (idx === -1) return

        painter.attributes[idx] = attribute
        setPainter({ ...painter })
    }
    return (
        <Runnable running={busy || !painter}>
            {painter && (
                <div className={getClassNames(props)}>
                    {renderHeader(error, handleSave, handleCancel, painter)}
                    <main>
                        <div>
                            <Button
                                wide={true}
                                icon={IconGear}
                                label="Recompile shaders to refresh preview"
                                enabled={painter !== validPainter}
                                onClick={handleCompile}
                            />
                            <Preview painter={validPainter} />
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
                                    value={painter.vertexShader}
                                    onChange={(vertexShader) =>
                                        update({ vertexShader })
                                    }
                                />
                            )}
                            {section === "frag" && (
                                <CodeEditor
                                    language="glsl"
                                    value={painter.fragmentShader}
                                    onChange={(fragmentShader) =>
                                        update({ fragmentShader })
                                    }
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
                                            value={
                                                painter.preview.data
                                                    .instanceCount ?? 0
                                            }
                                            onChange={(instanceCount) =>
                                                updatePreviewData({
                                                    instanceCount,
                                                })
                                            }
                                        />
                                        <InputInteger
                                            label="Vertices"
                                            size={4}
                                            value={
                                                painter.preview.data
                                                    .vertexCount ?? 0
                                            }
                                            onChange={(vertexCount) =>
                                                updatePreviewData({
                                                    vertexCount,
                                                })
                                            }
                                        />
                                        <InputInteger
                                            label="Elements"
                                            size={4}
                                            value={
                                                painter.preview.data
                                                    .elementCount ?? 0
                                            }
                                            onChange={(elementCount) =>
                                                updatePreviewData({
                                                    elementCount,
                                                })
                                            }
                                        />
                                        <Button
                                            label="Edit elements"
                                            icon={IconEdit}
                                            onClick={() =>
                                                setElementsEditorVisible(true)
                                            }
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
                                                data={
                                                    painter.preview.data
                                                        .attributes[att.name] ??
                                                    []
                                                }
                                                onChange={handleUpdateAttribute}
                                                onClick={(att) =>
                                                    setEditAttributeData(
                                                        att.name
                                                    )
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {error && (
                                <pre className="theme-color-error error">
                                    {error}
                                </pre>
                            )}
                            {renderHelp()}
                        </div>
                    </main>
                    {attribToEdit && (
                        <AttributeDataEditor
                            attribute={attribToEdit}
                            value={
                                painter.preview.data.attributes[
                                    attribToEdit.name
                                ] ?? []
                            }
                            onClose={() => setEditAttributeData(null)}
                            onChange={handleAttributeDataChange}
                        />
                    )}
                    {elementsEditorVisible && (
                        <ElementsEditor
                            value={painter.preview.data.elements ?? []}
                            onClose={() => setElementsEditorVisible(false)}
                            onChange={handleElementsChange}
                        />
                    )}
                </div>
            )}
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
