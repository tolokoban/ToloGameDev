import * as React from "react";
import { IAttribute } from '../../manager/code-generator/types';
import './attributes-tool.css';
export interface IAttributesToolProps {
    className?: string;
}
interface IAttributesToolState {
    attributes: IAttribute[];
    vertexCode: string;
    classCodeJS: string;
    classCodeTS: string;
}
export default class AttributesTool extends React.Component<IAttributesToolProps, IAttributesToolState> {
    state: IAttributesToolState;
    private readonly handleChange;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=attributes-tool.d.ts.map