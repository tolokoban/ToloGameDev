import * as React from "react"
import Button from "@/ui/view/button"
import IconAdd from "@/ui/view/icons/add"
import PaintersList from "../../painters/list"
import { getDataService } from "@/factory/data-service"
import { makeTGDPainter } from "../../../factory/painter"
import { TGDObject } from "@/types"
import "./main-page.css"

export interface MainPageProps {
    className?: string
    onPainterEdit(this: void, painter: TGDObject): void
}

export default function MainPages(props: MainPageProps) {
    const handleNewPainter = async () => {
        const svc = getDataService()
        const newPainter = makeTGDPainter()
        newPainter.name = `Painter ${Date.now()}`
        const id = await svc.painter.add(newPainter)
        props.onPainterEdit({ id, name: newPainter.name })
    }
    return (
        <div className={getClassNames(props)}>
            <header>
                <svg viewBox="0 0 24 24" height="2rem">
                    <path
                        fill="currentColor"
                        d="M7,6H5V4H7V6M17,6H19V4H17V6M23,12V18H21V14H19V18H17V16H7V18H5V14H3V18H1V12H3V10H5V8H7V6H9V8H15V6H17V8H19V10H21V12H23M15,10V12H17V10H15M7,12H9V10H7V12M11,18H7V20H11V18M17,18H13V20H17V18Z"
                    />
                </svg>
                <div>ToloGameDev</div>
                <div className="version">v0.2.0</div>
            </header>
            <main>
                <fieldset>
                    <legend>
                        <Button
                            icon={IconAdd}
                            label="Painters"
                            color="accent"
                            flat={false}
                            onClick={handleNewPainter}
                        />
                    </legend>
                    <PaintersList onClick={props.onPainterEdit} />
                </fieldset>
            </main>
        </div>
    )
}

function getClassNames(props: MainPageProps): string {
    const classNames = ["custom", "view-page-MainPage"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
