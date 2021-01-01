import * as React from "react";
import './attributes-tool.css';
declare type IAttributeType = "BYTE" | "SHORT" | "UNSIGNED_BYTE" | "UNSIGNED_SHORT" | "FLOAT" | "HALF_FLOAT";
interface IAttribute {
    name: string;
    type: IAttributeType;
    size: number;
    normalized: boolean;
}
export interface IAttributesToolProps {
    className?: string;
}
interface IAttributesToolState {
    attributes: IAttribute[];
    classCode: string;
}
export default class AttributesTool extends React.Component<IAttributesToolProps, IAttributesToolState> {
    state: IAttributesToolState;
    private readonly handleChange;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=attributes-tool.d.ts.map