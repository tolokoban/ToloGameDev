import * as React from "react"
import Combo from "@/ui/view/combo"
import PainterUniformEdit from "./painter-uniform-edit"
import PainterUniformSummary from "./painter-uniform-summary"
import { ComboItems } from "@/ui/view/combo/combo-view"
import { valueToPercent } from "@mui/base"
import "./painter-uniform-view.css"
import {
    TGDPainterUniform,
    TGDPainterUniformData,
    TGDPainterUniformDataType,
} from "@/types"

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
            <div className={getClassNames(props, "value")}>
                <Combo
                    value={props.value.data.type}
                    items={items}
                    onChange={(type) =>
                        props.onChange({
                            ...props.value,
                            data: makeData(props.value.data, type),
                        })
                    }
                />
                <PainterUniformSummary value={props.value.data} />
                <PainterUniformEdit
                    name={props.value.name}
                    value={props.value.data}
                    onChange={(data: any) =>
                        props.onChange({ ...props.value, data })
                    }
                />
            </div>
        </>
    )
}

function getClassNames(
    props: PainterUniformViewProps,
    extraClasses = ""
): string {
    const classNames = [
        "custom",
        "view-page-painter-section-data-PainterUniformView",
        extraClasses,
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

function makeData(
    data: TGDPainterUniformData,
    type: string
): TGDPainterUniformData {
    if (data.type === type) return data

    const dic = data as { [key: string]: unknown }
    switch (type) {
        case "Value":
            return {
                type,
                value: defaultNumber(dic.value, 1),
            }
        case "Slider":
            return {
                type,
                min: defaultNumber(dic.min, 0),
                max: defaultNumber(dic.max, 1),
                value: defaultNumber(dic.value, 0.5),
            }
        default:
            return { type } as TGDPainterUniformData
    }
}

function defaultNumber(value: unknown, defaultValue: number): number {
    return typeof value === "number" ? value : defaultValue
}

