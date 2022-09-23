import * as React from "react"
import Button from "@/ui/view/button"
import DataSection from "./section/data"
import DocumentationSection from "./section/documentation"
import IconGear from "@/ui/view/icons/gear"
import Modal from "@/ui/modal"
import ModeSection from "./section/mode"
import Pages from "../pages"
import PainterCompiler from "./painter-compiler"
import PainterHeader from "./header"
import Preview from "../../preview"
import Runnable from "@/ui/view/runnable"
import ShaderSection from "./section/shader"
import { PainterUpdater, usePainterUpdater } from "./hooks/painter-updater"
import { useLocalStorageState } from "@/ui/hooks"
import { usePainterLoader } from "./hooks/painter-loader"
import "./painter-page.css"

export interface PainterPageProps {
    className?: string
    id: number
    onClose(this: void): void
}

export default function PainterPage(props: PainterPageProps) {
    const refCompiler = React.useRef(new PainterCompiler())
    const updater = usePainterUpdater()
    const painter = updater.currentPainter
    const [section, setSection] = useLocalStorageState(
        "data",
        "painter/section"
    )
    const handleCompile = () => refCompiler.current.compile(updater)
    usePainterLoader(props.id, updater, handleCompile)
    const handleBack = useBackHandler(updater, props)
    return (
        <Runnable running={false} className={getClassNames(props)}>
            <PainterHeader
                section={section}
                onSectionChange={setSection}
                onBack={handleBack}
            />
            <main>
                <div>
                    <Button
                        wide={true}
                        icon={IconGear}
                        label="Recompile and save painter (Ctrl-Enter)"
                        enabled={painter !== updater.stablePainter}
                        onClick={handleCompile}
                        hotkey="C-enter"
                    />
                    {painter.error && (
                        <pre className="theme-color-error">{painter.error}</pre>
                    )}
                    <Preview painter={updater.stablePainter} />
                </div>
                <div>
                    <Pages page={section}>
                        <ShaderSection key="shaders" updater={updater} />
                        <DataSection key="data" updater={updater} />
                        <ModeSection key="mode" updater={updater} />
                        <DocumentationSection key="doc" />
                        <pre key="export" className="export">
                            {JSON.stringify(updater.stablePainter)}
                        </pre>
                    </Pages>
                </div>
            </main>
        </Runnable>
    )
}

function useBackHandler(updater: PainterUpdater, props: PainterPageProps) {
    return async () => {
        const confirm =
            updater.currentPainter === updater.stablePainter ||
            (await Modal.confirm(
                <div>
                    <div>
                        "You are about to revert all the changes you made for
                        these shaders."
                    </div>
                    <div>
                        This Painter will be automatically saved once compiled
                        successfully.
                    </div>
                </div>
            ))
        if (confirm) props.onClose()
    }
}

function getClassNames(props: PainterPageProps): string {
    const classNames = ["custom", "view-page-PainterPage"]
    if (typeof props.className === "string") {
        classNames.push(props.className)
    }

    return classNames.join(" ")
}
