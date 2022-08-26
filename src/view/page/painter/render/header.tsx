import * as React from "react"
import Button from "@/ui/view/button"
import Flex from "@/ui/view/flex"
import IconBack from "@/ui/view/icons/back"
import IconDelete from "@/ui/view/icons/delete"
import InputText from "@/ui/view/input/text"
import { PainterUpdater } from "../hooks/painter-updater"

export function renderHeader(handleCancel: () => Promise<void>) {
    return (
        <header>
            <Flex>
                <Button
                    flat={true}
                    label="Back"
                    icon={IconBack}
                    onClick={handleCancel}
                />
            </Flex>
            <Button color="accent" label="Delete" icon={IconDelete} />
        </header>
    )
}
