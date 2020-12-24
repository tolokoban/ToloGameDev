/// <reference types="react" />
import ArticleView from '../../../view/article';
import './intro-page.css';
export default class IntroView extends ArticleView {
    renderChild(type: string, attribs: {
        [key: string]: string;
    }, content: string, key: number): JSX.Element | null;
    getSourceURL(): string;
    getTitle(): string;
}
//# sourceMappingURL=intro-page.d.ts.map