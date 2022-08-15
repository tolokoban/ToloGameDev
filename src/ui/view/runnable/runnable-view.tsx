import * as React from "react"
import "./runnable-view.css"

export interface RunnableViewProps {
    className?: string
    running: boolean
    children: React.ReactNode
}

/**
 * Use this component around inputs you want to disable during some running refresh.
 * It can be used with forms that trigger network queries, for instance.
 * @param props.running If `true` a "refresh" animation is displayed and the content
 * is not touchable.
 */
export default function RunnableView(props: RunnableViewProps) {
    return (
        <div className={getClassNames(props)}>
            <div className="children">{props.children}</div>
            <div className="overlay">
                <svg viewBox="0 0 24 24">
                    <path
                        fill="currentColor"
                        d="M7,6H5V4H7V6M17,6H19V4H17V6M23,12V18H21V14H19V18H17V16H7V18H5V14H3V18H1V12H3V10H5V8H7V6H9V8H15V6H17V8H19V10H21V12H23M15,10V12H17V10H15M7,12H9V10H7V12M11,18H7V20H11V18M17,18H13V20H17V18Z"
                    />
                </svg>
            </div>
        </div>
    )
}

function getClassNames(props: RunnableViewProps): string {
    const classNames = ["custom", "ui-view-RunnableView"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }
    if (props.running) classNames.push("running")

    return classNames.join(" ")
}
