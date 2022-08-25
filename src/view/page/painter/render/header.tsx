import * as React from "react"
import Button from "@/ui/view/button"
import Flex from "@/ui/view/flex"
import IconCancel from "@/ui/view/icons/cancel"
import IconDelete from "@/ui/view/icons/delete"
import InputText from "@/ui/view/input/text"
import { PainterUpdater } from "../hooks/painter-updater"

export function renderHeader(
    handleCancel: () => Promise<void>,
    updater: PainterUpdater
) {
    const painter = updater.currentPainter
    return (
        <header>
            <Flex>
                <Button
                    flat={true}
                    label="Cancel"
                    icon={IconCancel}
                    onClick={handleCancel}
                />
            </Flex>
            <InputText
                label={`Painter's name (#${painter.id})`}
                value={painter.name}
                onChange={updater.setName}
            />
            <Button color="accent" label="Delete" icon={IconDelete} />
        </header>
    )
}
