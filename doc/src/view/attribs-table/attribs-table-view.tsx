import * as React from "react"
import Button from "tfw/view/button"
import CodeGenerator from '../../manager/code-generator'
import { IAttribute } from '../../manager/code-generator/types'
import DialogFactory from 'tfw/factory/dialog'
import TabStrip from 'tfw/layout/tabstrip'
import CodeView from '../code'

import './attribs-table-view.css'


export interface IAttribsTableViewProps {
    className?: string
    attributes: IAttribute[]
}

// tslint:disable-next-line: no-empty-interface
interface IAttribsTableViewState { }

export default class AttribsTableView extends React.Component<IAttribsTableViewProps, IAttribsTableViewState> {
    state: IAttribsTableViewState = {}

    private readonly handleShowCode = () => {
        const { attributes } = this.props
        const dialog = DialogFactory.show({
            title: "Code for attributes",
            footer: <Button
                label="Close"
                icon="close"
                onClick={() => dialog.hide()}
            />,
            content: <TabStrip
                headers={["Typescript", "Javascript", "Vertex Shader"]}
                scrollable={true}
            >
                <CodeView
                    lang="ts"
                    content={CodeGenerator.Attributes.gererateTypescript(attributes)}
                />
                <CodeView
                    lang="js"
                    content={CodeGenerator.Attributes.gererateJavascript(attributes)}
                />
                <CodeView
                    lang="glsl"
                    content={CodeGenerator.Attributes.generateVertexShader(attributes)}
                />
            </TabStrip>,
            closeOnBackgroundClick: true,
            closeOnEscape: true
        })
    }

    render() {
        const { attributes } = this.props
        const classNames = ['custom', 'view-AttribsTableView']
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <div className={classNames.join(" ")}>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Norm.?</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        attributes.map(att => <tr>
                            <td className="name">{att.name}</td>
                            <td className="type">{
                                `${att.type
                                }${att.size > 1 ? `[${att.size}]` : ""}`
                            }</td>
                            <td>{
                                att.normalized ?
                                    <b>Yes</b> :
                                    <span>No</span>
                            }</td>
                        </tr>)
                    }
                </tbody>
            </table>
            <div>
                <Button
                    flat={false}
                    icon="show"
                    width="auto"
                    label="Show Code"
                    onClick={this.handleShowCode}
                />
            </div>
        </div>
    }
}
