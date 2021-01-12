/// <reference types="react" />
import ArticleView from '../../../view/article';
export default class UniformsView extends ArticleView {
    renderChild(type: string, attribs: {
        [key: string]: string;
    }, content: string, key: number): JSX.Element | null;
    getSourceURL(): string;
    getTitle(): string;
}
//# sourceMappingURL=varyings-lesson.d.ts.map