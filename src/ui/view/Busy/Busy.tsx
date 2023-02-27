import React from "react"
import Theme from "@/ui/theme"
import Style from "./Busy.module.css"
import IconSpaceInvader from "@/ui/view/icons/IconSpaceInvader"
import { Icon } from "../icons/generic/generic-icon"

const $ = Theme.classNames

export interface BusyProps {
    className?: string
    busy: boolean
    icon?: Icon
    children: React.ReactNode
}

export default function Busy({
    busy,
    className,
    icon = IconSpaceInvader,
    children,
}: BusyProps) {
    return (
        <div className={$.join(className, Style.Busy)}>
            {children}
            {busy && <div className={Style.busy}>{icon({})}</div>}
        </div>
    )
}
