import * as React from "react"
import Dialog from "./view"
import Modal from "@/ui/modal"

export async function editUint16Array(
    caption: string,
    data: number[],
    columns = 3
): Promise<number[]> {
    return new Promise<number[]>((resolve) => {
        const modal = Modal.show({
            autoClosable: true,
            content: (
                <Dialog
                    caption={caption}
                    columns={columns}
                    value={data}
                    onCancel={() => {
                        modal.hide()
                        resolve(data)
                    }}
                    onValidate={(value) => {
                        modal.hide()
                        resolve(value)
                    }}
                />
            ),
        })
    })
}