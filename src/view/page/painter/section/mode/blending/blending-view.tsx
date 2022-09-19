import * as React from "react"
import BlendingEquaInput from "@/view/blending-equa"
import BlendingFuncInput from "@/view/blending-func"
import Checkbox from "@/ui/view/checkbox"
import Flex from "@/ui/view/flex"
import { PainterUpdater } from "../../../hooks/painter-updater"
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
                            <BlendingEquaInput
                                label="Equation for RGB"
                                value={value.equaRGB}
                                onChange={(equaRGB) => update({ equaRGB })}
                            />
                            <BlendingEquaInput
                                label="Equation for Alpha"
                                value={value.equaAlpha}
                                onChange={(equaAlpha) => update({ equaAlpha })}
                            />
                        </Flex>
                        <Flex justifyContent="space-between">
                            <BlendingFuncInput
                                label="Source RGB"
                                value={value.funcSrcRGB}
                                onChange={(funcSrcRGB) =>
                                    update({ funcSrcRGB })
                                }
                            />
                            <BlendingFuncInput
                                label="Source Alpha"
                                value={value.funcSrcAlpha}
                                onChange={(funcSrcAlpha) =>
                                    update({ funcSrcAlpha })
                                }
                            />
                        </Flex>
                        <Flex justifyContent="space-between">
                            <BlendingFuncInput
                                label="Destination RGB"
                                value={value.funcDstRGB}
                                onChange={(funcDstRGB) =>
                                    update({ funcDstRGB })
                                }
                            />
                            <BlendingFuncInput
                                label="Destination Alpha"
                                value={value.funcDstAlpha}
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
