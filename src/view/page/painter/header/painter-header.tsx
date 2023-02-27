import Button from "@/ui/view/Button"
import { Icon } from "@/ui/view/icons/generic/generic-icon"
import IconBack from "@/ui/view/icons/IconBack"
import IconChecked from "@/ui/view/icons/IconChecked"
import IconCode from "@/ui/view/icons/IconCode"
import IconData from "@/ui/view/icons/IconData"
import IconExport from "@/ui/view/icons/IconExport"
import IconHelp from "@/ui/view/icons/IconHelp"
import IconTexture from "@/ui/view/icons/IconTexture"
import Options from "@/ui/view/Options"
import Panel from "@/ui/view/Panel"
import "./painter-header.css"

export interface PainterHeaderProps {
    section: string
    onSectionChange(this: void, section: string): void
    onBack(this: void): void
}

export default function PainterHeader({
    section,
    onSectionChange,
    onBack,
}: PainterHeaderProps) {
    return (
        <header className="view-page-painter-header-PainterHeader">
            <Panel display="flex">
                <Button variant="text" icon={IconBack} onClick={onBack}>
                    Back
                </Button>
            </Panel>
            <Options
                options={{
                    data: makeItem(IconData, "Data"),
                    mode: makeItem(IconChecked, "Mode"),
                    shaders: makeItem(IconCode, "Shaders"),
                    textures: makeItem(IconTexture, "Textures"),
                    export: makeItem(IconExport, "Export"),
                    doc: makeItem(IconHelp, "Docs"),
                }}
                value={section}
                onChange={onSectionChange}
            />
        </header>
    )
}

function makeItem(IconData: Icon, label: string): JSX.Element {
    return (
        <div className="section-item">
            <IconData />
            <div>{label}</div>
        </div>
    )
}
