import * as React from "react"
import ObjectButton from "../../object-button"
import Runnable from "@/ui/view/runnable"
import { TGDObject } from "@/types"
import { usePaintersList } from "@/hooks/painters-list"
import "./painters-list.css"

export interface PaintersListProps {
    className?: string
    onClick(this: void, painter: TGDObject): void
}

export default function PaintersList(props: PaintersListProps) {
    const painters = usePaintersList()
    return (
        <Runnable className={getClassNames(props)} running={!painters}>
            {painters &&
                painters.map((item) => (
                    <ObjectButton
                        key={item.id}
                        type="painter"
                        value={item}
                        onClick={props.onClick}
                    />
                ))}
            {Array.isArray(painters) && painters.length === 0 && (
                <p>
                    No Painter has been created yet.
                    <br />
                    Use the above button to add a new one.
                </p>
            )}
        </Runnable>
    )
}

function getClassNames(props: PaintersListProps): string {
    const classNames = ["custom", "view-program-LisShaders"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
