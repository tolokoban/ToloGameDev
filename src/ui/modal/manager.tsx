import JSON5 from "json5"
import React from "react"
import Dialog from "../view/Dialog"
import Style from "./manager.module.css"
import {
    ConfirmParams,
    Modal,
    ModalManagerInterface,
    ModalParams,
} from "./types"
import Spinner from "../view/Spinner"

const EMPTY_FUNCTION = () => {}

export default class ModalManager implements ModalManagerInterface {
    public modals: Modal[] = []
    public setModals: (modals: Modal[]) => void = EMPTY_FUNCTION

    show(params: ModalParams) {
        const modal: Modal = {
            align: "",
            padding: "1em",
            transitionDuration: 300,
            autoClosable: true,
            background: "var(--theme-color-neutral-2-opacity-40)",
            onClose: EMPTY_FUNCTION,
            status: "new",
            ...params,
        }
        this.setModals([...this.modals, modal])
        return () => {
            modal.status = "closing"
            this.setModals(this.modals.filter((m) => m !== modal))
        }
    }

    async wait<T>(
        content: React.ReactNode,
        promise: Promise<T>,
        params?: Partial<Omit<ModalParams, "content">>
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            const hide = this.show({
                ...params,
                content: (
                    <div className={Style.wait}>
                        <Spinner>{content}</Spinner>
                    </div>
                ),
            })
            promise
                .then((arg: T) => {
                    hide()
                    window.setTimeout(() => resolve(arg))
                })
                .catch((ex) => {
                    hide()
                    window.setTimeout(() => reject(ex))
                })
        })
    }

    async error(
        content: unknown,
        params?: Partial<ModalParams>
    ): Promise<void> {
        return new Promise((resolve) => {
            const hide = this.show({
                ...params,
                onClose() {
                    if (params?.onClose) params.onClose()
                    hide()
                    resolve()
                },
                content: (
                    <Dialog
                        buttonCancel={{ visible: false }}
                        buttonOK={{
                            onClick() {
                                hide()
                                resolve()
                            },
                        }}
                    >
                        <div className={Style.error}>
                            {renderHumanFriendlyErrorContent(content)}
                        </div>
                    </Dialog>
                ),
            })
        })
    }

    async confirm(params: ConfirmParams): Promise<boolean> {
        return new Promise((resolve) => {
            const hide = this.show({
                ...params,
                onClose() {
                    if (params.onClose) params.onClose()
                    resolve(false)
                },
                content: (
                    <Dialog
                        buttonCancel={{
                            onClick() {
                                hide()
                                resolve(false)
                            },
                            children: params.labelCancel,
                        }}
                        buttonOK={{
                            onClick() {
                                hide()
                                resolve(true)
                            },
                            color:
                                params.accent === true
                                    ? "tertiary-5"
                                    : "secondary-5",
                            children:
                                params.labelOK ??
                                (typeof params.content === "string"
                                    ? params.content
                                    : "OK"),
                        }}
                        title={params.title}
                    >
                        {params.content}
                    </Dialog>
                ),
            })
        })
    }

    info(
        content: React.ReactNode,
        params?: Partial<Omit<ModalParams, "content">> | undefined
    ): Promise<void> {
        return new Promise((resolve) => {
            const hide = this.show({
                ...params,
                onClose() {
                    if (params?.onClose) params.onClose()
                    hide()
                    resolve()
                },
                content: (
                    <Dialog
                        buttonCancel={{ visible: false }}
                        buttonOK={{
                            variant: "text",
                            onClick() {
                                hide()
                                resolve()
                            },
                        }}
                    >
                        {content}
                    </Dialog>
                ),
            })
        })
    }
}

export function renderHumanFriendlyErrorContent(
    content: unknown
): React.ReactNode {
    if (typeof content === "string") return <div>{content}</div>
    if (content instanceof Error)
        return (
            <div>
                <b>{content.name}</b>
                <br />
                {content.message}
            </div>
        )
    if (typeof content === "object" && React.isValidElement(content))
        return content
    return <pre>{JSON5.stringify(content, null, "  ")}</pre>
}
