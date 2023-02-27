import * as React from "react"
import Translate from '../../../translate'
import Button from "../button/button-view"
import './ok-cancel-view.css'


export interface OkCancelViewProps {
    className?: string
    labelCancel?: string
    labelOK?: string
    onOK(): void
    onCancel(): void
    enabled?: boolean
}

export default function OkCancelView(props: OkCancelViewProps) {
    return (
        <div className={getClassNames(props)}>
            <Button
                label={props.labelCancel ?? Translate.cancel}
                flat={true}
                onClick={props.onCancel}
            />
            <Button
                label={props.labelOK ?? Translate.ok}
                enabled={props.enabled ?? true}
                onClick={props.onCancel}
            />
        </div>
    )
}


function getClassNames(props: OkCancelViewProps): string {
    const classNames = ['custom', 'ui-view-OkCancelView']
    if (typeof props.className === 'string') {
        classNames.push(props.className)
    }

    return classNames.join(' ')
}
