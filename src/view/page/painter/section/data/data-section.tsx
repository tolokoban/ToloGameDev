import * as React from "react"
import Button from "@/ui/view/button"
import Flex from "@/ui/view/flex"
import IconEdit from "@/ui/view/icons/edit"
import InputInteger from "@/ui/view/input/integer"
import InputText from "@/ui/view/input/text"
import Label from "@/ui/view/label"
import PainterAttributeView from "./painter-attribute"
import PainterUniformView from "./painter-uniform"
import { editFloat32Array } from "@/editor/float32array"
import { editUint16Array } from "@/editor/uint16array"
import { PainterUpdater } from "../../hooks/painter-updater"
import { TGDPainter, TGDPainterAttribute } from "@/types"
import "./data-section.css"

export default function DataSection(props: { updater: PainterUpdater }) {
    const { updater } = props
    const painter = updater.currentPainter
    const handleEditElements = useEditElementsHandler(painter, updater)
    const handleEditAttributeData = useEditAttributeDataHandler(updater)
    return (
        <div className="view-page-painter-section-Data">
            <h1>Data</h1>
            <Flex wrap="wrap">
                <InputText
                    wide={true}
                    label={`Painter's name (#${painter.id})`}
                    value={painter.name}
                    onChange={updater.setName}
                />

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
                <InputInteger
                    label="Loops"
                    size={4}
                    value={painter.count.loop}
                    onChange={updater.setLoopCount}
                />
                <Button
                    label={`Edit elements (${painter.elements.length})`}
                    icon={IconEdit}
                    onClick={handleEditElements}
                />
            </Flex>
            <div className="uniforms">
                <Label value="Uniform" />
                <Label value="Type" />
                {painter.uniforms.map((uni) => (
                    <PainterUniformView
                        key={uni.name}
                        value={uni}
                        onChange={(upt) => updater.updateUniform(uni.name, upt)}
                    />
                ))}
            </div>
            <div className="attributes">
                <Label value="Attribute" />
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
        </div>
    )
}

function useEditAttributeDataHandler(updater: PainterUpdater) {
    return async (att: TGDPainterAttribute) => {
        const data = await editFloat32Array(
            `Attribute: ${att.name}`,
            att.data,
            att.dim * att.size
        )
        updater.updateAttribute(att.name, { data })
    }
}

function useEditElementsHandler(painter: TGDPainter, updater: PainterUpdater) {
    return async () => {
        const data = await editUint16Array("Elements", painter.elements)
        updater.setElements(data)
    }
}
