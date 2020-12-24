/**
 * Display a piece of code with Copy to Clipboard feature.
 */
import * as React from "react";
import './code-view.css';
export interface ICodeViewProps {
    className?: string;
    content: string;
    lang: "js" | "ts" | "glsl";
}
interface ICodeViewState {
}
export default class CodeView extends React.Component<ICodeViewProps, ICodeViewState> {
    private refPre;
    state: ICodeViewState;
    private readonly highlight;
    componentDidMount: () => void;
    componentDidUpdate: () => void;
    private readonly handleCopy;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=code-view.d.ts.map