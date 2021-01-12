import * as React from "react";
import './code-editor-view.css';
export interface ICodeEditorViewProps {
    className?: string;
    lang: string;
    code: string;
    onChange(code: string): void;
}
interface ICodeEditorViewState {
}
export default class CodeEditorView extends React.Component<ICodeEditorViewProps, ICodeEditorViewState> {
    state: ICodeEditorViewState;
    private readonly handleChange;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=code-editor-view.d.ts.map