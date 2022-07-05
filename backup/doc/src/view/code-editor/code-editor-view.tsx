import * as React from "react"

import './code-editor-view.css'


export interface ICodeEditorViewProps {
    className?: string
    lang: string
    code: string
    onChange(code: string): void
}

// tslint:disable-next-line: no-empty-interface
interface ICodeEditorViewState {}

export default class CodeEditorView extends React.Component<ICodeEditorViewProps, ICodeEditorViewState> {
    state: ICodeEditorViewState = {}

    private readonly handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const code = evt.target.value
        this.props.onChange(code)
    }

    render() {
        const classNames = ['custom', 'view-CodeEditorView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <textarea
            className={classNames.join(" ")}
            onChange={this.handleChange}
            value={this.props.code}
            spellCheck={false}
            rows={20}
        ></textarea>
    }
}
