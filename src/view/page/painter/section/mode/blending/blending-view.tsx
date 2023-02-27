import * as React from "react"
import Checkbox from "@/ui/view/Checkbox"
import ConstSelect from "@/view/const-select"
import Panel from "@/ui/view/Panel"
import { PainterUpdater } from "../../../hooks/painter-updater"
import { WEBGL2 } from "@/tgd/constants"
import "./blending-view.css"
import CodeExpander from "../../../../../CodeExpander"
import { generateBlendTest } from "../../../../../../factory/code/generate-blend-test"

export interface BlendingViewProps {
    className?: string
    updater: PainterUpdater
}

export default function BlendingView(props: BlendingViewProps) {
    const update = props.updater.updateBlending
    const value = props.updater.currentPainter.blending
    return (
        <fieldset>
            <legend>Blending</legend>
            <div className={getClassNames(props)}>
                <Checkbox
                    value={value.enabled}
                    onChange={(enabled) => update({ enabled })}
                >
                    Enabled?
                </Checkbox>
                {value.enabled && (
                    <>
                        <Panel
                            display="grid"
                            gridTemplateColumns="repeat(4, auto)"
                            gap="M"
                            margin={["M", 0]}
                        >
                            <div></div>
                            <div>Equation</div>
                            <div>Source</div>
                            <div>Destination</div>
                            <div>RGB</div>
                            <ConstSelect
                                label="Equation for RGB"
                                value={value.equaRGB}
                                items={WEBGL2.blendEqua}
                                onChange={(equaRGB) => update({ equaRGB })}
                            />
                            <ConstSelect
                                label="Source RGB"
                                value={value.funcSrcRGB}
                                items={WEBGL2.blendFunc}
                                onChange={(funcSrcRGB) =>
                                    update({ funcSrcRGB })
                                }
                            />
                            <ConstSelect
                                label="Destination RGB"
                                value={value.funcDstRGB}
                                items={WEBGL2.blendFunc}
                                onChange={(funcDstRGB) =>
                                    update({ funcDstRGB })
                                }
                            />
                            <div>Alpha</div>
                            <ConstSelect
                                label="Equation for Alpha"
                                value={value.equaAlpha}
                                items={WEBGL2.blendEqua}
                                onChange={(equaAlpha) => update({ equaAlpha })}
                            />
                            <ConstSelect
                                label="Source Alpha"
                                value={value.funcSrcAlpha}
                                items={WEBGL2.blendFunc}
                                onChange={(funcSrcAlpha) =>
                                    update({ funcSrcAlpha })
                                }
                            />
                            <ConstSelect
                                label="Destination Alpha"
                                value={value.funcDstAlpha}
                                items={WEBGL2.blendFunc}
                                onChange={(funcDstAlpha) =>
                                    update({ funcDstAlpha })
                                }
                            />
                        </Panel>
                    </>
                )}
                <CodeExpander>{generateBlendTest(value)}</CodeExpander>
            </div>
        </fieldset>
    )
}

function getClassNames(props: BlendingViewProps): string {
    const classNames = ["custom", "view-page-painter-section-mode-BlendingView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
