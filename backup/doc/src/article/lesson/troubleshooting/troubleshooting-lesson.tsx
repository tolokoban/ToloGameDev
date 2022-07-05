import * as React from "react"
import Draw from '../../../view/draw'
import ArticleView from '../../../view/article'
import Content from './troubleshooting-lesson.md'


export default class IntroView extends ArticleView {
    renderChild(
        type: string,
        attribs: { [key: string]: string },
        content: string, key: number
    ): JSX.Element | null {
        switch (type) {
            default: return null
        }
    }
    getSourceURL() { return Content }
    getTitle() { return "Troubleshooting" }

}
