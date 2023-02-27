import * as React from "react"
import { ModalManagerInterface } from "@/ui/modal/types"
import Dialog from "./view"

export async function editFloat32Array(
    modal: ModalManagerInterface,
    caption: string,
    data: number[],
    columns: number
): Promise<number[]> {
    return new Promise<number[]>((resolve) => {
        const hide = modal.show({
            autoClosable: true,
            content: (
                <Dialog
                    caption={caption}
                    columns={columns}
                    value={data}
                    onCancel={() => {
                        hide()
                        resolve(data)
                    }}
                    onValidate={(value) => {
                        hide()
                        resolve(value)
                    }}
                />
            ),
        })
    })
}
