/**
 * Easy to use scene animator
 */
import * as React from "react";
import TGD from 'tolo-game-dev';
import './scene-view.css';
export declare class IScene extends TGD.Scene {
}
export interface ISceneViewProps<T> {
    className?: string;
    onInit(scene: IScene): T;
    onAnim?(time: number, scene: IScene, runtime: T): void;
}
export default class SceneView<T = undefined> extends React.Component<ISceneViewProps<T>> {
    private refCanvas;
    private scene?;
    private runtime;
    componentDidMount(): void;
    private readonly anim;
    render(): JSX.Element;
}
//# sourceMappingURL=scene-view.d.ts.map