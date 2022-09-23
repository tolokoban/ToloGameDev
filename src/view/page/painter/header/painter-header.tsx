import * as React from "react"
import Button from "@/ui/view/button"
import Flex from "@/ui/view/flex"
import IconBack from "@/ui/view/icons/back"
import IconChecked from "@/ui/view/icons/checked"
import IconCode from "@/ui/view/icons/code"
import IconData from "@/ui/view/icons/data"
import IconExport from "@/ui/view/icons/export"
import IconHelp from "@/ui/view/icons/help"
import IconTexture from "@/ui/view/icons/texture"
import Options from "@/ui/view/options"
import { Icon } from "@/ui/view/icons/generic"
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
            <Flex>
                <Button
                    flat={true}
                    label="Back"
                    icon={IconBack}
                    onClick={onBack}
                />
            </Flex>
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
