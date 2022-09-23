import * as React from "react"
import Button from "@/ui/view/button"
import Checkbox from "@/ui/view/checkbox"
import CodeEditor from "@/view/code-editor"
import ConstSelect from "../../../../../const-select"
import Flex from "@/ui/view/flex"
import IconShow from "@/ui/view/icons/show"
import InputFloat from "@/ui/view/input/float"
import Modal from "@/ui/modal"
import { PainterUpdater } from "../../../hooks/painter-updater"
import { TGDPainter } from "@/types"
import { WEBGL2 } from "../../../../../../tgd/constants"
import "./depth-view.css"

export interface DepthViewProps {
    className?: string
    updater: PainterUpdater
}

export default function DepthView(props: DepthViewProps) {
    const { updater } = props
    const painter = updater.currentPainter
    const handleShowDepthCode = makeShowDepthCodeHandler(painter)
    return (
        <fieldset>
            <legend>Depth</legend>
            <div className={getClassNames(props)}>
                <Flex>
                    <Checkbox
                        label="Depth Test?"
                        value={painter.depth.enabled}
                        onChange={updater.setDepthEnabled}
                    />
                    {painter.depth.enabled && (
                        <Checkbox
                            label="Write Z to depth buffer (depthMask)?"
                            value={painter.depth.mask}
                            onChange={updater.setDepthMask}
                        />
                    )}
                </Flex>
                {painter.depth.enabled && (
                    <>
                        <ConstSelect
                            items={WEBGL2.depthFunc}
                            value={painter.depth.func}
                            onChange={updater.setDepthFunc}
                        />
                        <Flex>
                            <InputFloat
                                min={0}
                                max={1}
                                size={2}
                                label="Clear"
                                value={painter.depth.clear}
                                onChange={updater.setDepthClear}
                            />
                            <InputFloat
                                min={0}
                                max={1}
                                size={2}
                                label="Near"
                                value={painter.depth.range.near}
                                onChange={updater.setDepthRangeNear}
                            />
                            <InputFloat
                                min={0}
                                max={1}
                                size={2}
                                label="Far"
                                value={painter.depth.range.far}
                                onChange={updater.setDepthRangeFar}
                            />
                            <Button
                                icon={IconShow}
                                flat={true}
                                label="Code"
                                onClick={handleShowDepthCode}
                            />
                        </Flex>
                    </>
                )}
            </div>
        </fieldset>
    )
}

function makeShowDepthCodeHandler(painter: TGDPainter) {
    return () => {
        Modal.info(
            <CodeEditor
                language="ts"
                value={`gl.enable(gl.DEPTH_TEST)
gl.clearDepth(${painter.depth.clear})
gl.depthFunc(gl.${painter.depth.func})
gl.depthMask(${painter.depth.mask})
gl.depthRange(${painter.depth.range.near}, ${painter.depth.range.far})
`}
            />
        )
    }
}

function getClassNames(props: DepthViewProps): string {
    const classNames = ["custom", "view-page-painter-section-mode-DepthView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
