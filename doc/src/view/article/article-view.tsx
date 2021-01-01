/**
 * This component helps to write articles in Markdown syntax with
 * embeded JSX in it.
 */

import * as React from "react"
import MarkdownToJSX from 'markdown-to-jsx'
import Highlighter from 'highlight.js'
import AttribsTable from '../attribs-table'
import { IAttribute, IAttributeType } from "../../manager/code-generator/types"
import castBoolean from 'tfw/converter/boolean'
import castInteger from 'tfw/converter/integer'

import './article-view.css'


export interface IArticleViewProps {
    className?: string
}

interface IArticleViewState {
    content: string
}

export default abstract class ArticleView extends React.Component<IArticleViewProps, IArticleViewState> {
    private ref = React.createRef<HTMLDivElement>()
    state: IArticleViewState = {
        content: ""
    }

    abstract getSourceURL(): string
    abstract getTitle(): string

    async componentDidMount() {
        const src = this.getSourceURL()
        this.setState({ content: "" })
        try {
            const response = await fetch(src)
            const content = await response.text()
            this.setState({ content })
        } catch (ex) {
            console.error("Unable to load markdown from", src)
            console.error(ex)
            this.setState({
                content: `<div class="error">
Unable to load URL:  
\`${src}\`
</div>`})
        }
    }

    componentDidUpdate() {
        const article = this.ref.current
        if (!article) return

        const codes = article.querySelectorAll("pre > code")
        for (const code of codes) {
            Highlighter.highlightBlock(code as HTMLElement)
            const pre = code.parentElement
            if (pre) {
                pre.classList.add(
                    ...code.classList
                )
            }
        }
    }

    abstract renderChild(
        type: string,
        attribs: { [key: string]: string },
        content: string,
        key: number): JSX.Element | null

    private readonly createElement = (
        type: string,
        props: { [key: string]: any },
        ...children: React.ReactChild[]
    ) => {
        if (type === "Att") {
            return renderAttribs(readContent(children))
        }
        const firstLetter = type.charAt(0)
        if (firstLetter === firstLetter.toUpperCase()) {
            const attribs = readAttribs(props)
            const content = readContent(children)
            const key: number = parseInt(`${props.key}`, 10)
            return this.renderChild(type, attribs, content, key)
                ?? <div />
        }
        return React.createElement(
            type, props, ...children
        )
    }

    render() {
        const { content } = this.state
        const classNames = ['custom', 'view-ArticleView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <article className={classNames.join(" ")} ref={this.ref}>
            <header className="thm-ele-header">{this.getTitle()}</header>
            <MarkdownToJSX
                options={{
                    forceBlock: true,
                    createElement: this.createElement
                }}
            >{content}</MarkdownToJSX>
        </article>
    }
}


function readContent(children: React.ReactChild[]): string {
    let content = ""
    for (const child of children) {
        if (typeof child === 'string') {
            content += child
        } else if (Array.isArray(child)) {
            content += readContent(child)
        } else {
            console.log("[article-view] child = ", child) // @FIXME: Remove this line written on 2020-12-21 at 11:39
        }
    }

    return content
}

function readAttribs(props: { [key: string]: any }): { [key: string]: string } {
    const attribs: { [key: string]: string } = {}
    for (const key of Object.keys(props)) {
        const val = props[key]
        if (typeof val === 'string') {
            attribs[key] = val
        }
    }

    return attribs
}

function renderAttribs(content: string): JSX.Element {
    console.log("[article-view] content = ", content) // @FIXME: Remove this line written on 2020-12-28 at 14:25
    const RX_SEP = /[ \t,;|]+/
    const attributes: IAttribute[] = []
    const lines = content.trim().split("\n")
    for (const line of lines) {
        const [name, type, size, norm] = line.split(RX_SEP)
        console.log("[article-view] [name, type, size, norm] = ", [name, type, size, norm]) // @FIXME: Remove this line written on 2020-12-28 at 14:24
        if (name.trim().length === 0) continue

        const attType = getAttType(type)
        if (!attType) {
            console.error("Unknown attribute type:", type)
            continue
        }

        const attSize = castInteger(size, 1)
        const attNorm = castBoolean(norm, false)
        attributes.push({
            name, type: attType, size: attSize, normalized: attNorm
        })
    }

    return <AttribsTable attributes={attributes} />
}

function getAttType(type: string): IAttributeType | null {
    switch (type.toLowerCase()) {
        case "byte": return "BYTE"
        case "float": return "FLOAT"
        case "half-float": return "HALF_FLOAT"
        case "short": return "SHORT"
        case "ubyte": return "UNSIGNED_BYTE"
        case "ushort": return "UNSIGNED_SHORT"
        default: return null
    }
}