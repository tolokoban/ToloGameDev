import * as React from "react"

export interface PagesProps {
    page: string
    children: JSX.Element[]
}

export default function Pages(props: PagesProps) {
    return <>{props.children.find((child) => child.key === props.page)}</>
}
