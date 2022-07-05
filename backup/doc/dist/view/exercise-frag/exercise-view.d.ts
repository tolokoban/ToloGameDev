/**
 * Exercise on Fragment Shader.
 */
import * as React from "react";
import './exercise-view.css';
export interface IExerciseViewProps {
    className?: string;
    id: string;
    painter(gl: WebGL2RenderingContext | WebGLRenderingContext, prg: WebGLProgram): void;
    vert: string;
    frag: string;
}
interface IExerciseViewState {
    frag: string;
    error: string;
}
export default class ExerciseView extends React.Component<IExerciseViewProps, IExerciseViewState> {
    private lastFragGot?;
    private refGot;
    private refExpected;
    state: IExerciseViewState;
    private readonly handleChange;
    private readonly repaint;
    componentDidMount: (...args: any[]) => void;
    componentDidUpdate(): void;
    private paint;
    private readonly handleSolution;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=exercise-view.d.ts.map