/**
 * Display a piece of code with Copy to Clipboard feature.
 */
import * as React from "react"
import Touchable from 'tfw/view/touchable'
import NotifyFactory from 'tfw/factory/notify'
import Highlighter from 'highlight.js'

import './code-view.css'

export interface ICodeViewProps {
    className?: string
    content: string
    lang: "js" | "ts" | "glsl"
}

// tslint:disable-next-line: no-empty-interface
interface ICodeViewState { }

export default class CodeView extends React.Component<ICodeViewProps, ICodeViewState> {
    private refPre = React.createRef<HTMLPreElement>()
    state: ICodeViewState = {}

    private readonly highlight = () => {
        const pre = this.refPre.current
        if (!pre) return

        const codes = pre.querySelectorAll("code")
        for (const code of codes) {
            Highlighter.highlightBlock(code)
            const parent = code.parentElement
            if (parent) {
                parent.classList.add(
                    ...code.classList
                )
            }
        }
    }

    componentDidMount = this.highlight
    componentDidUpdate = this.highlight

    private readonly handleCopy = () => {
        const { content } = this.props
        window.navigator.clipboard.writeText(content)
        NotifyFactory.info(<div>
            This code has been pasted to your Clipboard.
        </div>)
    }

    render() {
        const { content, lang } = this.props
        const classNames = ['custom', 'view-CodeView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <Touchable
            className={classNames.join(" ")}
            onClick={this.handleCopy}
        >
            <pre ref={this.refPre} className={`view-CodeView-pre lang-${lang}`}>
                <code>{content}</code>
            </pre>
        </Touchable>
    }
}
