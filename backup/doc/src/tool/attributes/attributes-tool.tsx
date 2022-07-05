import * as React from "react"
import AttributesEditor from '../../view/attributes-editor'
import CodeView from '../../view/code'
import { IAttribute } from '../../manager/code-generator/types'
import CodeGenerator from '../../manager/code-generator'
import TabStrip from 'tfw/layout/tabstrip'

import './attributes-tool.css'


export interface IAttributesToolProps {
    className?: string
}

interface IAttributesToolState {
    attributes: IAttribute[]
    vertexCode: string
    classCodeJS: string
    classCodeTS: string
}

export default class AttributesTool extends React.Component<IAttributesToolProps, IAttributesToolState> {
    state: IAttributesToolState = {
        attributes: [],
        vertexCode: "",
        classCodeJS: "",
        classCodeTS: ""
    }

    private readonly handleChange = (attributes: IAttribute[]) => {
        this.setState({
            attributes,
            vertexCode: CodeGenerator.Attributes.generateVertexShader(attributes),
            classCodeJS: CodeGenerator.Attributes.gererateJavascript(attributes),
            classCodeTS: CodeGenerator.Attributes.gererateTypescript(attributes)
        })
    }

    render() {
        const { classCodeJS, classCodeTS, vertexCode } = this.state
        const classNames = [
            'custom',
            'tool-AttributesTool',
            'thm-ele-header',
            'thm-bg0'
        ]
        if (typeof this.props.className === 'string') {
            classNames.push(this.props.className)
        }

        return <div className={classNames.join(" ")}>
            <div>
                <AttributesEditor
                    onChange={this.handleChange}
                />
                <div></div>
            </div>
            <TabStrip
                scrollable={true}
                headers={["Typescript", "Ecmascript"]}
            >
                <CodeView
                    lang="ts"
                    content={classCodeTS}
                />
                <CodeView
                    lang="js"
                    content={classCodeJS}
                />
            </TabStrip>
            <CodeView
                    lang="glsl"
                    content={vertexCode}
                />
        </div>
    }
}


