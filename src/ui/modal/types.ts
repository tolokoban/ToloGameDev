import React from "react"

export type ModalParams = Partial<Modal> & { content: React.ReactNode }

export interface ConfirmParams extends ModalParams {
    /** If defined, it will be the header of the modal dialog box. */
    title?: string
    /** Default to `false`. If `true`, OK button will be accented (secondary color). */
    accent?: boolean
    /** Default to `title` or "OK" if undefined. */
    labelOK?: string
    /** Default to "Cancel". */
    labelCancel?: string
}

export interface ModalOptions {
    content: React.ReactNode
    align:
        | ""
        | "L"
        | "R"
        | "T"
        | "B"
        | "BL"
        | "LB"
        | "BR"
        | "BL"
        | "TL"
        | "LT"
        | "TR"
        | "TL"
    padding: string | 0
    transitionDuration: number
    /**
     * By default the background is a semi-transparent black,
     * but you can put any valid CSS color in this attribute.
     */
    background: string
    /**
     * Default to `true`. If `true` the modal window can be closed by
     * clicking outside its frame or by pressing ESC on the keyboard.
     */
    autoClosable: boolean
    /**
     * This function is called when the modal window is closed by
     * the ESC key or by a click outside its frame.
     */
    onClose(this: void): void
}

export interface Modal extends ModalOptions {
    status: "new" | "open" | "closing" | "closed"
}

export interface ModalManagerInterface {
    /**
     * Show a new modal and return a function to hide it.
     */
    show(params: ModalParams): () => void

    wait<T>(
        content: React.ReactNode,
        promise: Promise<T>,
        params?: Partial<Omit<ModalParams, "content">>
    ): Promise<T>

    error(content: unknown, params?: Partial<ModalParams>): Promise<void>

    confirm(params: ConfirmParams): Promise<boolean>

    info(
        content: React.ReactNode,
        params?: Partial<Omit<ModalParams, "content">>
    ): Promise<void>
}
