/**
 * This component helps to write articles in Markdown syntax with
 * embeded JSX in it.
 */
import * as React from "react";
import './article-view.css';
export interface IArticleViewProps {
    className?: string;
}
interface IArticleViewState {
    content: string;
}
export default abstract class ArticleView extends React.Component<IArticleViewProps, IArticleViewState> {
    private ref;
    state: IArticleViewState;
    abstract getSourceURL(): string;
    abstract getTitle(): string;
    componentDidMount(): Promise<void>;
    componentDidUpdate(): void;
    abstract renderChild(type: string, attribs: {
        [key: string]: string;
    }, content: string, key: number): JSX.Element | null;
    private readonly createElement;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=article-view.d.ts.map