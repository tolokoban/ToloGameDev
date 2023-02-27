import { WEBGL2 } from "@/tgd/constants"
import { TGDPainter } from "@/types"
import Checkbox from "@/ui/view/Checkbox"
import InputFloat from "@/ui/view/InputFloat"
import Label from "@/ui/view/Label"
import Panel from "@/ui/view/Panel"
import CodeExpander from "@/view/CodeExpander"
import InputColumns from "@/view/InputColumns"
import { generateDepthTest } from "../../../../../../factory/code/generate-depth-test"
import ConstSelect from "../../../../../const-select"
import { PainterUpdater } from "../../../hooks/painter-updater"
import "./depth-view.css"

export interface DepthViewProps {
    className?: string
    updater: PainterUpdater
}

export default function DepthView(props: DepthViewProps) {
    const { updater } = props
    const painter = updater.currentPainter
    return (
        <fieldset>
            <legend>Depth</legend>
            <div className={getClassNames(props)}>
                <Panel display="flex">
                    <Checkbox
                        value={painter.depth.enabled}
                        onChange={updater.setDepthEnabled}
                    >
                        Depth Test?
                    </Checkbox>
                    {painter.depth.enabled && (
                        <>
                            <ConstSelect
                                label="Test"
                                items={WEBGL2.depthFunc}
                                value={painter.depth.func}
                                onChange={updater.setDepthFunc}
                            />
                            <Checkbox
                                value={painter.depth.mask}
                                onChange={updater.setDepthMask}
                            >
                                Write Z to depth buffer (depthMask)?
                            </Checkbox>
                        </>
                    )}
                </Panel>
                {painter.depth.enabled && (
                    <>
                        <InputColumns columns={3}>
                            <Label value="Clear">
                                <InputFloat
                                    min={0}
                                    max={1}
                                    maxWidth="2em"
                                    value={painter.depth.clear}
                                    onChange={updater.setDepthClear}
                                />
                            </Label>
                            <Label value="Near">
                                <InputFloat
                                    min={0}
                                    max={1}
                                    maxWidth="2em"
                                    value={painter.depth.range.near}
                                    onChange={updater.setDepthRangeNear}
                                />
                            </Label>
                            <Label value="Far">
                                <InputFloat
                                    min={0}
                                    max={1}
                                    maxWidth="2em"
                                    value={painter.depth.range.far}
                                    onChange={updater.setDepthRangeFar}
                                />
                            </Label>
                        </InputColumns>
                    </>
                )}
                <CodeExpander>{generateDepthTest(painter.depth)}</CodeExpander>
            </div>
        </fieldset>
    )
}

function getClassNames(props: DepthViewProps): string {
    const classNames = ["custom", "view-page-painter-section-mode-DepthView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
