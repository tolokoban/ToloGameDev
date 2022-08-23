import * as React from "react"
import Button from "@/ui/view/button"
import Flex from "@/ui/view/flex"
import IconCancel from "@/ui/view/icons/cancel"
import IconDelete from "@/ui/view/icons/delete"
import IconSave from "@/ui/view/icons/export"
import InputText from "@/ui/view/input/text"
import { TGDPainter } from "@/types"

export function renderHeader(
    error: string | null,
    handleSave: () => Promise<void>,
    handleCancel: () => Promise<void>,
    painter: TGDPainter
) {
    return (
        <header>
            <Flex>
                <Button
                    color="accent"
                    label="Save"
                    enabled={error === null}
                    icon={IconSave}
                    onClick={handleSave}
                />
                <Button
                    flat={true}
                    label="Cancel"
                    icon={IconCancel}
                    onClick={handleCancel}
                />
            </Flex>
            <InputText
                label={`Shaders name (#${painter.id})`}
                value={painter.name}
                onChange={(value) => (painter.name = value)}
            />
            <Button color="accent" label="Delete" icon={IconDelete} />
        </header>
    )
}
