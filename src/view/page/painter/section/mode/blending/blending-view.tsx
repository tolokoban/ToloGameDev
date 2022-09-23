import * as React from "react"
import Checkbox from "@/ui/view/checkbox"
import ConstSelect from "@/view/const-select"
import Flex from "@/ui/view/flex"
import { PainterUpdater } from "../../../hooks/painter-updater"
import { WEBGL2 } from "@/tgd/constants"
import "./blending-view.css"

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
                    label="Enabled?"
                    value={value.enabled}
                    onChange={(enabled) => update({ enabled })}
                />
                {value.enabled && (
                    <>
                        <Flex justifyContent="space-between">
                            <ConstSelect
                                label="Equation for RGB"
                                value={value.equaRGB}
                                items={WEBGL2.blendEqua}
                                onChange={(equaRGB) => update({ equaRGB })}
                            />
                            <ConstSelect
                                label="Equation for Alpha"
                                value={value.equaAlpha}
                                items={WEBGL2.blendEqua}
                                onChange={(equaAlpha) => update({ equaAlpha })}
                            />
                        </Flex>
                        <Flex justifyContent="space-between">
                            <ConstSelect
                                label="Source RGB"
                                value={value.funcSrcRGB}
                                items={WEBGL2.blendFunc}
                                onChange={(funcSrcRGB) =>
                                    update({ funcSrcRGB })
                                }
                            />
                            <ConstSelect
                                label="Source Alpha"
                                value={value.funcSrcAlpha}
                                items={WEBGL2.blendFunc}
                                onChange={(funcSrcAlpha) =>
                                    update({ funcSrcAlpha })
                                }
                            />
                        </Flex>
                        <Flex justifyContent="space-between">
                            <ConstSelect
                                label="Destination RGB"
                                value={value.funcDstRGB}
                                items={WEBGL2.blendFunc}
                                onChange={(funcDstRGB) =>
                                    update({ funcDstRGB })
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
                        </Flex>
                    </>
                )}
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
