/**
 * This editor helps you generate the right code to deal
 * with your attributes.
 */
import * as React from "react";
import './attributes-editor-view.css';
declare type IAttributeType = "BYTE" | "SHORT" | "UNSIGNED_BYTE" | "UNSIGNED_SHORT" | "FLOAT" | "HALF_FLOAT";
interface IAttribute {
    name: string;
    type: IAttributeType;
    size: number;
    normalized: boolean;
}
export interface IAttributesEditorViewProps {
    className?: string;
    onChange?(attributes: IAttribute[]): void;
}
interface IAttributesEditorViewState {
    attributes: IAttribute[];
    attribute: IAttribute;
}
export default class AttributesEditorView extends React.Component<IAttributesEditorViewProps, IAttributesEditorViewState> {
    state: IAttributesEditorViewState;
    componentDidMount(): void;
    private readonly handleAddAttribute;
    private fire;
    private select;
    private remove;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=attributes-editor-view.d.ts.map