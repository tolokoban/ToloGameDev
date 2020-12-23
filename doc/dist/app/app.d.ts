import React from 'react';
import './app.css';
interface IArticle {
    title: string;
    keywords: string[];
    content: React.LazyExoticComponent<typeof React.Component>;
}
export interface IAppProps {
    className?: string;
}
interface IAppState {
    hash: string;
    article: IArticle | null;
}
export default abstract class App extends React.Component<IAppProps, IAppState> {
    state: IAppState;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private readonly handleHashChange;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=app.d.ts.map