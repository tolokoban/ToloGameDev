import * as React from "react"
import AttributeDataEditor from "./attribute-data-editor"
import Button from "@/ui/view/button"
import CodeEditor from "@/view/code-editor"
import debouncer from "../../../tools/async/debouncer"
import Flex from "@/ui/view/flex"
import IconCancel from "@/ui/view/icons/cancel"
import IconDelete from "@/ui/view/icons/delete"
import IconSave from "@/ui/view/icons/export"
import InputInteger from "@/ui/view/input/integer"
import InputText from "@/ui/view/input/text"
import Label from "@/ui/view/label"
import Modal from "@/ui/modal"
import Options from "@/ui/view/options"
import PainterAttributeView from "./painter-attribute"
import PainterCompiler from "@/tools/webgl/painter-compiler"
import Runnable from "@/ui/view/runnable"
import { getDataService } from "@/factory/data-service"
import { makeTGDPainter } from "../../../factory/painter"
import { TGDPainter, TGDPainterData } from "@/types"
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
    const [shaderToShow, setShaderToShow] = React.useState("vert")
    const [error, setError] = React.useState<null | string>(null)
    const [busy, setBusy] = React.useState(true)
    const [painter, setPainter] = React.useState<TGDPainter>(makeTGDPainter())
    const compile = debouncer((newPainter: TGDPainter) => {
        setError(refCompiler.current.compile(newPainter))
        setPainter({ ...newPainter })
    }, 500)
    const update = (value: Partial<TGDPainter>) => {
        const newPainter = { ...painter, ...value }
        setPainter(newPainter)
        void compile(newPainter)
    }
    const updatePreviewData = (value: Partial<TGDPainterData>) => {
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
    React.useEffect(() => {
        if (props.id === -1) {
            setBusy(false)
            return
        }
        setBusy(true)
        getDataService()
            .painter.get(props.id)
            .then((value) => {
                setBusy(false)
                if (value) setPainter(value)
            })
            .catch((ex) =>
                console.error(`Unable to get painter #${props.id}!`, ex)
            )
    }, [props.id])
    const handleCancel = async () => {
        const confirm = await Modal.confirm(
            "You are about to revert all the changes you made for these shaders"
        )
        if (confirm) props.onClose()
    }
    const handleSave = async () => {
        const svc = getDataService()
        await Modal.wait("Saving...", svc.painter.update(painter))
        props.onClose()
    }
    const attribToEdit = painter.attributes.find(
        (att) => att.name === editAttributeData
    )
    const handleAttributeDataChange = (data: number[]) => {
        setEditAttributeData(null)
        if (!attribToEdit) return

        const newPainter = { ...painter }
        newPainter.preview.data.attributes[attribToEdit.name] = data
        setPainter(newPainter)
    }
    return (
        <Runnable running={busy}>
            <div className={getClassNames(props)}>
                <header>
                    <Flex>
                        <Button
                            color="accent"
                            label="Save"
                            enabled={error === null}
                            icon={IconSave}
                            onClick={handleSave}
                        />
                        <Button
                            flat={true}
                            label="Cancel"
                            icon={IconCancel}
                            onClick={handleCancel}
                        />
                    </Flex>
                    <InputText
                        label={`Shaders name (#${painter.id})`}
                        value={painter.name}
                        onChange={(value) => (painter.name = value)}
                    />
                    <Button color="accent" label="Delete" icon={IconDelete} />
                </header>
                <main>
                    <div>
                        <h1>Preview</h1>
                        <canvas className="theme-shadow-header"></canvas>
                        <h1>Data</h1>
                        <Flex wrap="wrap">
                            <InputInteger
                                label="Instances"
                                size={4}
                                value={painter.preview.data.instanceCount ?? 0}
                                onChange={(instanceCount) =>
                                    updatePreviewData({ instanceCount })
                                }
                            />
                            <InputInteger
                                label="Vertices"
                                size={4}
                                value={painter.preview.data.vertexCount ?? 0}
                                onChange={(vertexCount) =>
                                    updatePreviewData({ vertexCount })
                                }
                            />
                            <InputInteger
                                label="Elements"
                                size={4}
                                value={painter.preview.data.elementCount ?? 0}
                                onChange={(elementCount) =>
                                    updatePreviewData({ elementCount })
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
                                        painter.preview.data.attributes[
                                            att.name
                                        ] ?? []
                                    }
                                    onChange={() => {}}
                                    onClick={(att) =>
                                        setEditAttributeData(att.name)
                                    }
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <Options
                            wide={true}
                            options={{
                                vert: "Vertex Shader",
                                frag: "Fragment Shader",
                            }}
                            value={shaderToShow}
                            onChange={setShaderToShow}
                        />
                        <br />
                        {shaderToShow === "vert" && (
                            <CodeEditor
                                language="glsl"
                                value={painter.vertexShader}
                                onChange={(vertexShader) =>
                                    update({ vertexShader })
                                }
                            />
                        )}
                        {shaderToShow === "frag" && (
                            <CodeEditor
                                language="glsl"
                                value={painter.fragmentShader}
                                onChange={(fragmentShader) =>
                                    update({ fragmentShader })
                                }
                            />
                        )}
                        {error && (
                            <pre className="theme-color-error error">
                                {error}
                            </pre>
                        )}
                    </div>
                    {error && <pre className="theme-color-error">{error}</pre>}
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
