import * as React from "react";
import './scene-view.css';
export interface ISceneViewProps {
    className?: string;
}
interface ISceneViewState {
}
export default class SceneView extends React.Component<ISceneViewProps, ISceneViewState> {
    private refCanvas;
    state: ISceneViewState;
    componentDidMount(): void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=scene-view.d.ts.map