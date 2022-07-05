import * as React from "react";
import { IAttribute } from '../../manager/code-generator/types';
import './attribs-table-view.css';
export interface IAttribsTableViewProps {
    className?: string;
    attributes: IAttribute[];
}
interface IAttribsTableViewState {
}
export default class AttribsTableView extends React.Component<IAttribsTableViewProps, IAttribsTableViewState> {
    state: IAttribsTableViewState;
    private readonly handleShowCode;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=attribs-table-view.d.ts.map