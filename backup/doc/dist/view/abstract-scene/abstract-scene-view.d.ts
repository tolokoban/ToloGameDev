import * as React from "react";
import * as TGD from 'tolo-game-dev';
import './abstract-scene-view.css';
export interface IAbstractSceneViewProps {
    className?: string;
}
export default abstract class AbstractSceneView extends React.Component<IAbstractSceneViewProps> {
    private readonly refCanvas;
    private animating;
    private animatable;
    private scene;
    componentDidMount(): Promise<void>;
    start(): void;
    private readonly paintNextFrame;
    /**
     * This is the place where to load all the assets,
     * create all programs, buffers, textures, etc.
     *
     * @param scene Superset of the current WebGL context.
     * @returns `true` if this is an animation.
     */
    abstract initialize(scene: TGD.Scene): Promise<boolean>;
    /**
     * This function is called at every frame since the animation is ON.
     *
     * @param scene Superset of the current WebGL context.
     * @param time Time in milliseconds from the start of the animation.
     */
    abstract anim(scene: TGD.Scene, time: number): any;
    render(): JSX.Element;
}
//# sourceMappingURL=abstract-scene-view.d.ts.map