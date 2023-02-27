import * as React from "react"
import Button from "@/ui/view/Button"
import Panel from "@/ui/view/Panel"
import IconEdit from "@/ui/view/icons/IconEdit"
import InputInteger from "@/ui/view/InputInteger"
import InputText from "@/ui/view/InputText"
import Label from "@/ui/view/Label"
import PainterAttributeView from "./painter-attribute"
import PainterUniformView from "./painter-uniform"
import { editFloat32Array } from "@/editor/float32array"
import { editUint16Array } from "@/editor/uint16array"
import { PainterUpdater } from "../../hooks/painter-updater"
import { TGDPainter, TGDPainterAttribute } from "@/types"
import Style from "./data-section.module.css"
import { useModal } from "@/ui/modal"
import InputColumns from "@/view/InputColumns"
import CodeExpander from "../../../../CodeExpander"
import { generateVertexArrayObject } from "../../../../../factory/code/generate-vertex-array-object"

export default function DataSection(props: { updater: PainterUpdater }) {
    const { updater } = props
    const painter = updater.currentPainter
    const handleEditElements = useEditElementsHandler(painter, updater)
    const handleEditAttributeData = useEditAttributeDataHandler(updater)
    return (
        <div className={Style.Data}>
            <h1>Data</h1>
            <Panel display="flex" flexWrap="wrap">
                <InputText
                    label={`Painter's name (#${painter.id})`}
                    value={painter.name}
                    onChange={updater.setName}
                />
                <InputColumns columns={4}>
                    <InputInteger
                        label="Instances"
                        maxWidth="3em"
                        value={painter.count.instance}
                        onChange={updater.setInstanceCount}
                    />
                    <InputInteger
                        label="Vertices"
                        maxWidth="3em"
                        value={painter.count.vertex}
                        onChange={updater.setVertexCount}
                    />
                    <InputInteger
                        label="Elements"
                        maxWidth="3em"
                        value={painter.count.element}
                        onChange={updater.setElementCount}
                    />
                    <InputInteger
                        label="Loops"
                        maxWidth="3em"
                        value={painter.count.loop}
                        onChange={updater.setLoopCount}
                    />
                </InputColumns>
                <Button
                    icon={IconEdit}
                    onClick={handleEditElements}
                >{`Edit elements (${painter.elements.length})`}</Button>
            </Panel>
            <fieldset className="wide">
                <legend>Uniforms</legend>
                <div className="uniforms">
                    <Label value="Uniform" />
                    <Label value="Type" />
                    {painter.uniforms
                        .filter((uni) => uni.active)
                        .map((uni) => (
                            <PainterUniformView
                                key={uni.name}
                                value={uni}
                                onChange={(upt) =>
                                    updater.updateUniform(uni.name, upt)
                                }
                            />
                        ))}
                </div>
            </fieldset>
            <fieldset className="wide">
                <legend>attributes</legend>
                <div className="attributes">
                    <Label value="Attribute" />
                    <Label value="Dyn." title="Dynamic" />
                    <Label value="Divisor" />
                    <Label value="Data (click to edit)" />
                    {painter.attributes
                        .filter((att) => att.active)
                        .map((att) => (
                            <PainterAttributeView
                                key={att.name}
                                active={true}
                                value={att}
                                data={att.data}
                                onChange={(upt) =>
                                    updater.updateAttribute(att.name, upt)
                                }
                                onClick={handleEditAttributeData}
                            />
                        ))}
                    {painter.attributes
                        .filter((att) => !att.active)
                        .map((att) => (
                            <PainterAttributeView
                                key={att.name}
                                active={false}
                                value={att}
                                data={att.data}
                                onChange={(upt) =>
                                    updater.updateAttribute(att.name, upt)
                                }
                                onClick={handleEditAttributeData}
                            />
                        ))}
                </div>
                <CodeExpander label="Vertex Array Object (VAO)">
                    {generateVertexArrayObject(
                        painter.attributes,
                        painter.count.element > 0
                    )}
                </CodeExpander>
            </fieldset>
        </div>
    )
}

function useEditAttributeDataHandler(updater: PainterUpdater) {
    const modal = useModal()
    return async (att: TGDPainterAttribute) => {
        const data = await editFloat32Array(
            modal,
            `Attribute: ${att.name}`,
            att.data,
            att.dim * att.size
        )
        updater.updateAttribute(att.name, { data })
    }
}

function useEditElementsHandler(painter: TGDPainter, updater: PainterUpdater) {
    const modal = useModal()
    return async () => {
        const data = await editUint16Array(modal, "Elements", painter.elements)
        updater.setElements(data)
    }
}
