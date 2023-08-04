import { useModal } from "@/ui/modal"
import State from "@/state"
import Busy from "@/ui/view/Busy"
import Button from "@/ui/view/Button"
import IconGear from "@/ui/view/icons/IconGear"
import * as React from "react"
import Panel from "../../../ui/view/Panel"
import Preview from "../../preview"
import Pages from "../pages"
import PainterHeader from "./header"
import { usePainterLoader } from "./hooks/painter-loader"
import { PainterUpdater, usePainterUpdater } from "./hooks/painter-updater"
import PainterCompiler from "./painter-compiler"
import "./painter-page.css"
import DataSection from "./section/data"
import DocumentationSection from "./section/documentation"
import ExportSection from "./section/export"
import ModeSection from "./section/mode"
import ShaderSection from "./section/shader"

export interface PainterPageProps {
    className?: string
    id: number
    onClose(this: void): void
}

export default function PainterPage(props: PainterPageProps) {
    const refCompiler = React.useRef(new PainterCompiler())
    const updater = usePainterUpdater()
    const painter = updater.currentPainter
    const [section, setSection] = State.pages.painter.section.useState()
    const handleCompile = () => refCompiler.current.compile(updater)
    usePainterLoader(props.id, updater, handleCompile)
    const handleBack = useBackHandler(updater, props)
    return (
        <Busy busy={false} className={getClassNames(props)}>
            <PainterHeader
                section={section}
                onSectionChange={setSection}
                onBack={handleBack}
            />
            <main>
                <div>
                    <Button
                        icon={IconGear}
                        enabled={painter !== updater.stablePainter}
                        onClick={handleCompile}
                        hotkey="C-enter"
                    >
                        Recompile and save painter (Ctrl-Enter)
                    </Button>
                    {painter.error && (
                        <Panel backColor="error" color="error">
                            <pre>{painter.error}</pre>
                        </Panel>
                    )}
                    <Preview painter={updater.stablePainter} />
                </div>
                <div>
                    <Pages page={section}>
                        <ShaderSection key="shaders" updater={updater} />
                        <DataSection key="data" updater={updater} />
                        <ModeSection key="mode" updater={updater} />
                        <DocumentationSection key="doc" />
                        <ExportSection
                            key="export"
                            painter={updater.stablePainter}
                        />
                    </Pages>
                </div>
            </main>
        </Busy>
    )
}

function useBackHandler(updater: PainterUpdater, props: PainterPageProps) {
    const modal = useModal()
    return async () => {
        const confirm =
            updater.currentPainter === updater.stablePainter ||
            (await modal.confirm({
                content: (
                    <div>
                        <div>
                            "You are about to revert all the changes you made
                            for these shaders."
                        </div>
                        <div>
                            This Painter will be automatically saved once
                            compiled successfully.
                        </div>
                    </div>
                ),
            }))
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
