import * as React from "react"

export interface PagesProps {
    children: JSX.Element[]
    page: string
}

export default function Pages({ page, children }: PagesProps) {
    const component =
        children.find((child) => child.key === page) ?? children[0]
    return <>{component}</>
}
