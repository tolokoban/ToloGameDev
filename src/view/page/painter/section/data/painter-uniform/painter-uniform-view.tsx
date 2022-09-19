import * as React from "react"
import Combo from "@/ui/view/combo"
import { ComboItems } from "@/ui/view/combo/combo-view"
import { TGDPainterUniform, TGDPainterUniformData } from "@/types"
import { valueToPercent } from "@mui/base"
import "./painter-uniform-view.css"

export interface PainterUniformViewProps {
    className?: string
    value: TGDPainterUniform
    onChange(value: TGDPainterUniform): void
}

export default function PainterUniformView(props: PainterUniformViewProps) {
    const items = filterItemsByType(props.value.type)
    return (
        <>
            <div className={getClassNames(props)} title={props.value.type}>
                {props.value.name}
            </div>
            <div className={getClassNames(props)}>
                <Combo
                    value={props.value.data.type}
                    items={items}
                    onChange={(type) =>
                        props.onChange({
                            ...props.value,
                            data: {
                                ...props.value.data,
                                type,
                            } as TGDPainterUniformData,
                        })
                    }
                />
            </div>
        </>
    )
}

function getClassNames(props: PainterUniformViewProps): string {
    const classNames = [
        "custom",
        "view-page-painter-section-data-PainterUniformView",
    ]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}

type Item = [name: string, node: React.ReactNode, ...types: string[]]

const ITEMS: Item[] = [
    ["Time", <div>Current time</div>, "FLOAT"],
    [
        "Pointer",
        <div>Mouse or Touch pointer</div>,
        "FLOAT_VEC2",
        "FLOAT_VEC3",
        "FLOAT_VEC4",
    ],
    ["AspectRatio", <div>Aspect Ratio (Width / height)</div>, "FLOAT"],
    ["InverseAspectRatio", <div>Inverse Aspect Ratio (h/w)</div>, "FLOAT"],
    ["AspectRatioCover", <div>Aspect Ratio Cover</div>, "FLOAT_VEC2"],
    ["AspectRatioContain", <div>Aspect Ratio Contain</div>, "FLOAT_VEC2"],
    ["VertexCount", <div>Vectex Count</div>, "FLOAT"],
    ["ElementCount", <div>Element Count</div>, "FLOAT"],
    ["InstanceCount", <div>Instance Count</div>, "FLOAT"],
    ["Texture", <div>Texture</div>, "SAMPLER_2D"],
    ["Value", <div>Value</div>, "FLOAT"],
    ["Slider", <div>Slider</div>, "FLOAT"],
    ["Random", <div>Random (from 0.0 to 1.0)</div>, "FLOAT"],
]

function filterItemsByType(type: string): ComboItems<string> {
    const items = ITEMS.filter(([_name, _node, ...types]) =>
        types.includes(type)
    ).map(([name, node]) => [name, node]) as ComboItems<string>
    return items.length > 0
        ? items
        : [
              [
                  "Error",
                  <div className="error">
                      Unknown type: <b>${type}</b>
                  </div>,
              ],
          ]
}
