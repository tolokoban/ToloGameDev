import React from "react"
import Theme from "@/ui/theme"
import Style from "./Dialog.module.css"
import Button, { ButtonProps } from "../Button"
import { Icon } from "../icons/generic/generic-icon"

const $ = Theme.classNames

interface FooterButtonProps extends ButtonProps {
    icon?: Icon
    visible: boolean
}

export interface DialogProps {
    className?: string
    title?: string
    buttonOK?: Partial<FooterButtonProps>
    buttonCancel?: Partial<FooterButtonProps>
    children: React.ReactNode
}

export default function Dialog({
    className,
    title,
    buttonOK,
    buttonCancel,
    children,
}: DialogProps) {
    const ok: FooterButtonProps = {
        children: "OK",
        visible: true,
        onClick() {},
        ...buttonOK,
    }
    const cancel: FooterButtonProps = {
        children: "Cancel",
        visible: true,
        onClick() {},
        ...buttonCancel,
    }
    return (
        <div className={$.join(className, Style.Dialog)}>
            {title && <header>{title}</header>}
            {children}
            {(ok.visible || cancel.visible) && (
                <footer>
                    {cancel.visible && <Button {...cancel} />}
                    {ok.visible && <Button {...ok} />}
                </footer>
            )}
        </div>
    )
}
