import React from "react"
import Theme from "@/ui/theme"
import Style from "./Tabs.module.css"
import { TabProps } from "../Tab"
import { ViewWithValue } from "../../types"

const $ = Theme.classNames

export type TabsProps = ViewWithValue<string> & {
    className?: string
    children: React.ReactElement<TabProps> | React.ReactElement<TabProps>[]
}

export default function Tabs({
    className,
    children,
    value,
    onChange,
}: TabsProps) {
    const [tabKey, setTabKey] = React.useState(value)
    const tabs = Array.isArray(children) ? children : [children]
    const tab = tabs.find((component) => component.key === tabKey)
    return (
        <div className={$.join(className, Style.Tabs)}>
            <header>
                {tabs.map((item) =>
                    item.key === tab?.key ? (
                        <div>{item.props.label}</div>
                    ) : (
                        <button
                            onClick={() => {
                                const key = `${item.key}`
                                setTabKey(key)
                                onChange?.(key)
                            }}
                        >
                            {item.props.label}
                        </button>
                    )
                )}
            </header>
            <main>{tab?.props.children}</main>
        </div>
    )
}
